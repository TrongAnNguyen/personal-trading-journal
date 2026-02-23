import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all notes for nodes
    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      select: { id: true, title: true },
    });

    // Fetch note to note links
    const noteLinks = await prisma.noteLink.findMany({
      where: {
        sourceNote: { userId: session.user.id },
      },
      select: { sourceNoteId: true, targetNoteId: true },
    });

    // Fetch trade to note links
    const tradeLinks = await prisma.tradeNoteLink.findMany({
      where: {
        note: { userId: session.user.id },
      },
      select: {
        noteId: true,
        tradeId: true,
        trade: { select: { symbol: true } },
      },
    });

    const graphData: any = { nodes: [], links: [] };

    // Set notes lookup to avoid duplicates
    const nodesMap = new Map();

    notes.forEach((n: any) => {
      if (!nodesMap.has(n.id)) {
        nodesMap.set(n.id, { id: n.id, title: n.title, type: "note" });
      }
    });

    // We only add Trades if they are actually linked to something in this graph.
    tradeLinks.forEach((l: any) => {
      if (!nodesMap.has(l.tradeId)) {
        nodesMap.set(l.tradeId, {
          id: l.tradeId,
          title: "Trade: " + l.trade.symbol,
          type: "trade",
        });
      }
    });

    noteLinks.forEach((nl) => {
      // Only include if both target and source exist
      if (nodesMap.has(nl.sourceNoteId) && nodesMap.has(nl.targetNoteId)) {
        graphData.links.push({
          source: nl.sourceNoteId,
          target: nl.targetNoteId,
        });
      }
    });

    tradeLinks.forEach((tl) => {
      if (nodesMap.has(tl.noteId) && nodesMap.has(tl.tradeId)) {
        // Bidirectional representation
        graphData.links.push({ source: tl.noteId, target: tl.tradeId });
      }
    });

    graphData.nodes = Array.from(nodesMap.values());

    return NextResponse.json(graphData);
  } catch (error: any) {
    console.error("Fetch graph error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
