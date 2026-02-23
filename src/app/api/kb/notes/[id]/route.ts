import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const note = await prisma.note.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error: any) {
    console.error("Fetch note error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, content } = await req.json();

    // Verify ownership
    const existingNode = await prisma.note.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingNode) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    // Update note content
    const updated = await prisma.note.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingNode.title,
        content: content !== undefined ? content : existingNode.content,
      },
    });

    // Optionally handle extracting "data-id" attributes to manage NoteLinks
    // using raw regex parsing.
    if (content) {
      const regex = /data-id="([a-zA-Z0-9-]+)"/g;
      const links = new Set<string>();
      let match;
      while ((match = regex.exec(content)) !== null) {
        links.add(match[1]);
      }

      await prisma.noteLink.deleteMany({
        where: { sourceNoteId: id },
      });
      await prisma.tradeNoteLink.deleteMany({
        where: { noteId: id },
      });

      for (const targetId of Array.from(links)) {
        // Try linking note
        try {
          await prisma.noteLink.create({
            data: {
              sourceNoteId: id,
              targetNoteId: targetId,
            },
          });
        } catch (e) {
          // If foreign key fails, it might be a Trade ID
          try {
            await prisma.tradeNoteLink.create({
              data: {
                noteId: id,
                tradeId: targetId,
              },
            });
          } catch (e2) {
            // Ignored, not a valid id
          }
        }
      }
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update note error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.note.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete note error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
