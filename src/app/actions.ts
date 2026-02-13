"use server";

import { prisma } from "@/lib/db";
import {
  createTradeSchema,
  closeTradeSchema,
  updateTradeSchema,
  type CreateTradeInput,
  type CloseTradeInput,
  type UpdateTradeInput,
} from "@/types/trade";
import { calculatePnL, calculateRiskReward } from "@/lib/calculations";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// ============================================================
// CREATE TRADE
// ============================================================

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

// ============================================================
// CLOSE TRADE
// ============================================================

export async function closeTrade(tradeId: string, input: CloseTradeInput) {
  const validated = closeTradeSchema.parse(input);

  // Get the existing trade for PnL calculation
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

// ============================================================
// UPDATE TRADE
// ============================================================

export async function updateTrade(tradeId: string, input: UpdateTradeInput) {
  const validated = updateTradeSchema.parse(input);

  // If exitPrice provided, calculate PnL
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

// ============================================================
// DELETE TRADE
// ============================================================

export async function deleteTrade(tradeId: string) {
  await prisma.trade.delete({
    where: { id: tradeId },
  });

  revalidatePath("/dashboard/trades");
  revalidatePath("/dashboard");

  return { success: true };
}

// ============================================================
// GET TRADES
// ============================================================

export async function getTrades(
  accountId?: string,
  status?: "OPEN" | "CLOSED",
) {
  const trades = await prisma.trade.findMany({
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

  return trades;
}

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

// ============================================================
// TAGS
// ============================================================

export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createTag(input: {
  name: string;
  type: string;
  color?: string;
}) {
  const tag = await prisma.tag.create({
    data: {
      name: input.name,
      type: input.type as "STRATEGY" | "MISTAKE" | "SETUP" | "MARKET_CONDITION",
      color: input.color,
    },
  });

  return tag;
}

// ============================================================
// ACCOUNTS
// ============================================================

export async function getAccounts() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAccount(input: {
  name: string;
  initialBalance: number;
  currency: string;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const account = await prisma.account.create({
    data: {
      userId: user.id,
      name: input.name,
      initialBalance: input.initialBalance,
      currency: input.currency,
    },
  });

  revalidatePath("/dashboard/accounts");
  return account;
}
