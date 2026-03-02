"use server";

import { CacheTTL } from "@/constants";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { getAuthenticatedUserId } from "./utils";

export type NoteWithMeta = {
  id: string;
  title: string;
  updatedAt: Date;
  createdAt: Date;
};

// ── Reads ──────────────────────────────────────────────────────────────────

export const getNotes = cache(
  async (sort: "asc" | "desc" = "desc"): Promise<NoteWithMeta[]> => {
    try {
      const userId = await getAuthenticatedUserId();
      const cacheKey = `user:${userId}:notes:list:${sort}`;

      const cached = await redis.get<NoteWithMeta[]>(cacheKey);
      if (cached) return cached;

      const notes = await prisma.note.findMany({
        where: { userId },
        orderBy: { updatedAt: sort },
        select: { id: true, title: true, updatedAt: true, createdAt: true },
      });

      await redis.set(cacheKey, notes, CacheTTL.OneWeek);
      return notes;
    } catch (error) {
      console.error("[GET_NOTES_ERROR]", error);
      return [];
    }
  },
);

export const getNote = cache(async (id: string) => {
  try {
    const userId = await getAuthenticatedUserId();
    const cacheKey = `user:${userId}:notes:detail:${id}`;

    const cached = await redis.get<any>(cacheKey);
    if (cached) return cached;

    const note = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) throw new Error("Not Found");

    await redis.set(cacheKey, note, CacheTTL.OneWeek);
    return note;
  } catch (error) {
    console.error("[GET_NOTE_ERROR]", error);
    throw error;
  }
});

export const searchKB = cache(async (query: string) => {
  try {
    const userId = await getAuthenticatedUserId();
    const cacheKey = `user:${userId}:notes:search:${query}`;

    const cached = await redis.get<any[]>(cacheKey);
    if (cached) return cached;

    const [notes, trades] = await Promise.all([
      prisma.note.findMany({
        where: {
          userId,
          title: { contains: query, mode: "insensitive" },
        },
        take: 5,
        select: { id: true, title: true },
      }),
      prisma.trade.findMany({
        where: {
          account: { userId },
          symbol: { contains: query, mode: "insensitive" },
        },
        take: 5,
        select: { id: true, symbol: true, side: true, entryTime: true },
      }),
    ]);

    const results = [
      ...notes.map((n) => ({
        id: n.id,
        label: n.title,
        type: "note" as const,
      })),
      ...trades.map((t) => ({
        id: t.id,
        label: `${t.symbol} (${t.side}) - ${new Date(t.entryTime).toLocaleDateString()}`,
        type: "trade" as const,
      })),
    ];

    await redis.set(cacheKey, results, CacheTTL.OneWeek);
    return results;
  } catch (error) {
    console.error("[SEARCH_KB_ERROR]", error);
    return [];
  }
});

export const getGraph = cache(async () => {
  try {
    const userId = await getAuthenticatedUserId();
    const cacheKey = `user:${userId}:notes:graph`;

    const cached = await redis.get<any>(cacheKey);
    if (cached) return cached;

    const [notes, noteLinks, tradeLinks] = await Promise.all([
      prisma.note.findMany({
        where: { userId },
        select: { id: true, title: true },
      }),
      prisma.noteLink.findMany({
        where: { sourceNote: { userId } },
        select: { sourceNoteId: true, targetNoteId: true },
      }),
      prisma.tradeNoteLink.findMany({
        where: { note: { userId } },
        select: {
          noteId: true,
          tradeId: true,
          trade: { select: { symbol: true } },
        },
      }),
    ]);

    const nodesMap = new Map<
      string,
      { id: string; title: string; type: string }
    >();

    notes.forEach((n) => {
      nodesMap.set(n.id, { id: n.id, title: n.title, type: "note" });
    });

    tradeLinks.forEach((l) => {
      if (!nodesMap.has(l.tradeId)) {
        nodesMap.set(l.tradeId, {
          id: l.tradeId,
          title: `Trade: ${l.trade.symbol}`,
          type: "trade",
        });
      }
    });

    const links: { source: string; target: string }[] = [];

    noteLinks.forEach((nl) => {
      if (nodesMap.has(nl.sourceNoteId) && nodesMap.has(nl.targetNoteId)) {
        links.push({ source: nl.sourceNoteId, target: nl.targetNoteId });
      }
    });

    tradeLinks.forEach((tl) => {
      if (nodesMap.has(tl.noteId) && nodesMap.has(tl.tradeId)) {
        links.push({ source: tl.noteId, target: tl.tradeId });
      }
    });

    const graph = { nodes: Array.from(nodesMap.values()), links };

    await redis.set(cacheKey, graph, CacheTTL.OneWeek);
    return graph;
  } catch (error) {
    console.error("[GET_GRAPH_ERROR]", error);
    return { nodes: [], links: [] };
  }
});

// ── Mutations ──────────────────────────────────────────────────────────────

export async function createNote(payload: {
  title?: string;
  content?: any;
  isStrategyTemplate?: boolean;
}) {
  try {
    const userId = await getAuthenticatedUserId();

    let initialContent = payload.content;
    if (payload.isStrategyTemplate) {
      const title = payload.title || "New Strategy";
      initialContent = {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: title }],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Hypothesis" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Explain the core logic behind this strategy...",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Setup Rules" }],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Rule 1" }],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Rule 2" }],
                  },
                ],
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Entry Criteria" }],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", text: "e.g. Price closes above MA20" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              { type: "text", text: "Exit Rules (Take Profit / Stop Loss)" },
            ],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Take Profit at 2R" }],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", text: "Stop Loss below swing low" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Review & Updates" }],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Initial review..." }],
                  },
                ],
              },
            ],
          },
        ],
      };
    }

    const note = await prisma.note.create({
      data: {
        userId,
        title: payload.title || "Untitled Note",
        content: initialContent || {
          type: "doc",
          content: [{ type: "paragraph" }],
        },
      },
    });

    await redis.delPrefix(`user:${userId}:notes`);
    revalidatePath("/dashboard/knowledge-base");
    return { data: note };
  } catch (error) {
    console.error("[CREATE_NOTE_ERROR]", error);
    return { error: "Failed to create note" };
  }
}

export async function updateNote(
  id: string,
  payload: { title?: string; content?: any },
) {
  try {
    const userId = await getAuthenticatedUserId();

    const existing = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!existing) throw new Error("Not Found");

    const updateData: { title?: string; content?: any } = {};
    let contentChanged = false;

    if (payload.title !== undefined && payload.title !== existing.title) {
      updateData.title = payload.title;
    }

    if (payload.content !== undefined) {
      const contentJson = JSON.parse(JSON.stringify(payload.content));
      if (JSON.stringify(contentJson) !== JSON.stringify(existing.content)) {
        updateData.content = contentJson;
        contentChanged = true;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return { data: existing };
    }

    const updated = await prisma.note.update({
      where: { id },
      data: updateData,
    });

    if (contentChanged) {
      const links = new Set<string>();
      const contentStr =
        typeof updateData.content === "string"
          ? updateData.content
          : JSON.stringify(updateData.content);
      const regex = /"id":"([a-zA-Z0-9-]+)"/g;
      const htmlRegex = /data-id="([a-zA-Z0-9-]+)"/g;

      let match;
      while ((match = regex.exec(contentStr)) !== null) {
        links.add(match[1]);
      }
      while ((match = htmlRegex.exec(contentStr)) !== null) {
        links.add(match[1]);
      }

      await prisma.noteLink.deleteMany({ where: { sourceNoteId: id } });
      await prisma.tradeNoteLink.deleteMany({ where: { noteId: id } });

      for (const targetId of Array.from(links)) {
        try {
          await prisma.noteLink.create({
            data: { sourceNoteId: id, targetNoteId: targetId },
          });
        } catch {
          try {
            await prisma.tradeNoteLink.create({
              data: { noteId: id, tradeId: targetId },
            });
          } catch {
            // not a valid linked id — ignore
          }
        }
      }
    }

    await redis.delPrefix(`user:${userId}:notes`);
    revalidatePath(`/dashboard/knowledge-base/${id}`);
    revalidatePath("/dashboard/knowledge-base");
    return { data: updated };
  } catch (error) {
    console.error("[UPDATE_NOTE_ERROR]", error);
    return { error: "Failed to update note" };
  }
}

export async function deleteNote(id: string) {
  try {
    const userId = await getAuthenticatedUserId();

    await prisma.note.delete({ where: { id, userId } });

    await redis.delPrefix(`user:${userId}:notes`);
    revalidatePath("/dashboard/knowledge-base");
    return { data: { success: true } };
  } catch (error) {
    console.error("[DELETE_NOTE_ERROR]", error);
    return { error: "Failed to delete note" };
  }
}
