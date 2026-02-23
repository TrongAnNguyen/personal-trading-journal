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

    const sort = req.nextUrl.searchParams.get("sort") || "desc";

    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: sort === "asc" ? "asc" : "desc",
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(notes);
  } catch (error: any) {
    console.error("Fetch notes error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, isStrategyTemplate } = await req.json();

    let initialContent = content;
    if (isStrategyTemplate) {
      initialContent = `# \${title || 'New Strategy'}

## Hypothesis
Explain the core logic behind this strategy...

## Setup Rules
- Rule 1
- Rule 2

## Entry Criteria
- e.g. Price closes above MA20

## Exit Rules (Take Profit / Stop Loss)
- Take Profit at 2R
- Stop Loss below swing low

## Review & Updates
- Initial review...
`;
    }

    const note = await prisma.note.create({
      data: {
        userId: session.user.id,
        title: title || "Untitled Note",
        content: initialContent || "",
      },
    });

    return NextResponse.json(note);
  } catch (error: any) {
    console.error("Create note error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
