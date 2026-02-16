"use server";

import { calculatePnL, calculateRiskReward } from "@/lib/calculations";
import { prisma } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  closeTradeSchema,
  createTradeSchema,
  Trade,
  updateTradeSchema,
  type CloseTradeInput,
  type CreateTradeInput,
  type UpdateTradeInput,
} from "@/types/trade";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export async function createTrade(input: CreateTradeInput) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const validated = createTradeSchema.parse(input);

  const trade = await prisma.trade.create({
    data: {
      accountId: validated.accountId,
      symbol: validated.symbol.toUpperCase(),
      assetClass: validated.assetClass,
      side: validated.side,
      entryPrice: validated.entryPrice,
      quantity: validated.quantity,
      fees: validated.fees ?? 0,
      stopLoss: validated.stopLoss,
      takeProfit: validated.takeProfit,
      entryTime: validated.entryTime ?? new Date(),
      emotionEntry: validated.emotionEntry,
      notes: validated.notes,
      status: "OPEN",
      checklist: {
        create: validated.checklist.map((item) => ({
          text: item.text,
          checked: item.checked,
        })),
      },
      tags: {
        create: validated.tags.map((tagId) => ({
          tagId,
        })),
      },
    },
    include: {
      tags: { include: { tag: true } },
      checklist: true,
    },
  });

  revalidatePath("/dashboard/trades");
  revalidatePath("/dashboard");

  return { success: true, trade };
}

export async function closeTrade(tradeId: string, input: CloseTradeInput) {
  const validated = closeTradeSchema.parse(input);

  const existingTrade = await prisma.trade.findUnique({
    where: { id: tradeId },
  });

  if (!existingTrade) {
    throw new Error("Trade not found");
  }

  const pnl = calculatePnL({
    entryPrice: Number(existingTrade.entryPrice),
    exitPrice: validated.exitPrice,
    quantity: Number(existingTrade.quantity),
    fees: Number(existingTrade.fees ?? 0) + (validated.fees ?? 0),
    side: existingTrade.side,
  });

  const riskReward = calculateRiskReward({
    entryPrice: Number(existingTrade.entryPrice),
    exitPrice: validated.exitPrice,
    stopLoss: existingTrade.stopLoss ? Number(existingTrade.stopLoss) : null,
  });

  const trade = await prisma.trade.update({
    where: { id: tradeId },
    data: {
      exitPrice: validated.exitPrice,
      exitTime: validated.exitTime ?? new Date(),
      emotionExit: validated.emotionExit,
      lessonsLearned: validated.lessonsLearned,
      fees: Number(existingTrade.fees ?? 0) + (validated.fees ?? 0),
      status: "CLOSED",
      pnl,
      riskReward,
    },
    include: {
      tags: { include: { tag: true } },
      checklist: true,
      attachments: true,
    },
  });

  revalidatePath("/dashboard/trades");
  revalidatePath("/dashboard");

  return { success: true, trade };
}

export async function updateTrade(tradeId: string, input: UpdateTradeInput) {
  const validated = updateTradeSchema.parse(input);

  let pnl: number | null = null;
  let riskReward: number | null = null;

  if (validated.exitPrice) {
    const existingTrade = await prisma.trade.findUnique({
      where: { id: tradeId },
    });

    if (existingTrade) {
      pnl = calculatePnL({
        entryPrice: validated.entryPrice ?? Number(existingTrade.entryPrice),
        exitPrice: validated.exitPrice,
        quantity: validated.quantity ?? Number(existingTrade.quantity),
        fees: validated.fees ?? Number(existingTrade.fees ?? 0),
        side: validated.side ?? existingTrade.side,
      });

      riskReward = calculateRiskReward({
        entryPrice: validated.entryPrice ?? Number(existingTrade.entryPrice),
        exitPrice: validated.exitPrice,
        stopLoss:
          validated.stopLoss ??
          (existingTrade.stopLoss ? Number(existingTrade.stopLoss) : null),
      });
    }
  }

  const trade = await prisma.trade.update({
    where: { id: tradeId },
    data: {
      ...(validated.symbol && { symbol: validated.symbol.toUpperCase() }),
      ...(validated.assetClass && { assetClass: validated.assetClass }),
      ...(validated.side && { side: validated.side }),
      ...(validated.entryPrice !== undefined && {
        entryPrice: validated.entryPrice,
      }),
      ...(validated.exitPrice !== undefined && {
        exitPrice: validated.exitPrice,
      }),
      ...(validated.quantity !== undefined && { quantity: validated.quantity }),
      ...(validated.fees !== undefined && { fees: validated.fees }),
      ...(validated.stopLoss !== undefined && { stopLoss: validated.stopLoss }),
      ...(validated.takeProfit !== undefined && {
        takeProfit: validated.takeProfit,
      }),
      ...(validated.emotionEntry !== undefined && {
        emotionEntry: validated.emotionEntry,
      }),
      ...(validated.emotionExit !== undefined && {
        emotionExit: validated.emotionExit,
      }),
      ...(validated.notes !== undefined && { notes: validated.notes }),
      ...(validated.lessonsLearned !== undefined && {
        lessonsLearned: validated.lessonsLearned,
      }),
      ...(pnl !== null && { pnl }),
      ...(riskReward !== null && { riskReward }),
      ...(validated.exitPrice && { status: "CLOSED" }),
    },
    include: {
      tags: { include: { tag: true } },
      checklist: true,
      attachments: true,
    },
  });

  revalidatePath("/dashboard/trades");
  revalidatePath(`/dashboard/trades/${tradeId}`);
  revalidatePath("/dashboard");

  return { success: true, trade };
}

export async function deleteTrade(tradeId: string) {
  await prisma.trade.delete({
    where: { id: tradeId },
  });

  revalidatePath("/dashboard/trades");
  revalidatePath("/dashboard");

  return { success: true };
}

export const getTrades = cache(async function (
  accountId?: string,
  status?: "OPEN" | "CLOSED",
) {
  const rawTrades = await prisma.trade.findMany({
    where: {
      ...(accountId && { accountId }),
      ...(status && { status }),
    },
    include: {
      tags: { include: { tag: true } },
      checklist: true,
      attachments: true,
    },
    orderBy: { entryTime: "desc" },
  });

  const trades: Trade[] = rawTrades.map((t: (typeof rawTrades)[number]) => ({
    ...t,
    entryPrice: Number(t.entryPrice),
    exitPrice: t.exitPrice ? Number(t.exitPrice) : null,
    quantity: Number(t.quantity),
    fees: t.fees ? Number(t.fees) : null,
    stopLoss: t.stopLoss ? Number(t.stopLoss) : null,
    takeProfit: t.takeProfit ? Number(t.takeProfit) : null,
    pnl: t.pnl ? Number(t.pnl) : null,
    riskReward: t.riskReward ? Number(t.riskReward) : null,
    tags: t.tags?.map((tt: (typeof t.tags)[number]) => tt.tag) ?? [],
    attachments: t.attachments ?? [],
    checklist: t.checklist ?? [],
  }));

  return trades;
});

export async function getTrade(tradeId: string) {
  const trade = await prisma.trade.findUnique({
    where: { id: tradeId },
    include: {
      tags: { include: { tag: true } },
      checklist: true,
      attachments: true,
      account: true,
    },
  });

  return trade;
}
