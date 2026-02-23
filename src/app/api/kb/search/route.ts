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

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    // Search Notes
    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 5,
      select: { id: true, title: true },
    });

    // Search Trades (by symbol)
    const trades = await prisma.trade.findMany({
      where: {
        account: {
          userId: session.user.id,
        },
        symbol: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 5,
      select: { id: true, symbol: true, side: true, entryTime: true },
    });

    const results = [
      ...notes.map((n: any) => ({ id: n.id, label: n.title, type: "note" })),
      ...trades.map((t: any) => ({
        id: t.id,
        label: `${t.symbol} (${t.side}) - ${new Date(t.entryTime).toLocaleDateString()}`,
        type: "trade",
      })),
    ];

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
