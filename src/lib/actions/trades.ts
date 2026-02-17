"use server";

import { CacheTTL } from "@/constants";
import { calculatePnL, calculateRiskReward } from "@/lib/calculations";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { serialize } from "@/lib/utils";
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
      volume: validated.volume,
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

  await redis.delPrefix(`user:${user.id}:trades:`);
  revalidatePath("/dashboard/trades");
  revalidatePath("/dashboard");

  return { success: true, trade: serialize(trade) };
}

export async function closeTrade(tradeId: string, input: CloseTradeInput) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

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
    volume: Number(existingTrade.volume),
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

  await redis.delPrefix(`user:${user.id}:trades:`);
  revalidatePath("/dashboard/trades");
  revalidatePath("/dashboard");

  return { success: true, trade: serialize(trade) };
}

export async function updateTrade(tradeId: string, input: UpdateTradeInput) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

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
        volume: validated.volume ?? Number(existingTrade.volume),
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
      ...(validated.volume !== undefined && { volume: validated.volume }),
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

  await redis.delPrefix(`user:${user.id}:trades:`);
  revalidatePath("/dashboard/trades");
  revalidatePath(`/dashboard/trades/${tradeId}`);
  revalidatePath("/dashboard");

  return { success: true, trade: serialize(trade) };
}

export async function deleteTrade(tradeId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.trade.delete({
    where: { id: tradeId },
  });

  await redis.delPrefix(`user:${user.id}:trades:`);
  revalidatePath("/dashboard/trades");
  revalidatePath("/dashboard");

  return { success: true };
}

export const getTrades = cache(async function (
  accountId?: string,
  status?: "OPEN" | "CLOSED",
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return serialize([]);

  const cacheKey = `user:${user.id}:trades:acc:${accountId || "all"}:stat:${status || "all"}`;

  try {
    const cached = await redis.get<Trade[]>(cacheKey);
    if (cached) return cached;
  } catch (error) {
    console.error("Cache retrieval failed:", error);
  }

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

  const trades: Trade[] = rawTrades.map((t: any) => ({
    ...t,
    tags: t.tags?.map((tt: any) => tt.tag) ?? [],
  }));

  const serialized = serialize(trades);

  try {
    await redis.set(cacheKey, serialized, CacheTTL.OneWeek);
  } catch (error) {
    console.error("Cache storage failed:", error);
  }

  return serialized;
});

export async function getTrade(tradeId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const cacheKey = `user:${user.id}:trades:id:${tradeId}`;

  try {
    const cached = await redis.get<Trade>(cacheKey);
    if (cached) return cached;
  } catch (error) {
    console.error("Cache retrieval failed:", error);
  }

  const trade = await prisma.trade.findUnique({
    where: { id: tradeId },
    include: {
      tags: { include: { tag: true } },
      checklist: true,
      attachments: true,
      account: true,
    },
  });

  if (!trade) return null;

  const flattenedTrade = {
    ...trade,
    tags: trade.tags.map((t) => t.tag),
  };

  const serialized = serialize(flattenedTrade);

  try {
    if (serialized) {
      await redis.set(cacheKey, serialized, CacheTTL.OneWeek);
    }
  } catch (error) {
    console.error("Cache storage failed:", error);
  }

  return serialized;
}
