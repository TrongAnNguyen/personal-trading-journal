"use server";

import { CacheTTL } from "@/constants";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { serialize } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { getAuthenticatedUserId } from "./utils";

export const getAccounts = cache(async function () {
  const userId = await getAuthenticatedUserId();

  const cacheKey = `user:${userId}:accounts`;

  try {
    const cached = await redis.get<any[]>(cacheKey);
    if (cached) return cached;
  } catch (error) {
    console.error("Cache retrieval failed:", error);
  }

  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const serialized = serialize(accounts);

  try {
    await redis.set(cacheKey, serialized, CacheTTL.OneWeek);
  } catch (error) {
    console.error("Cache storage failed:", error);
  }

  return serialized;
});

export async function createAccount(input: {
  name: string;
  initialBalance: number;
  currency: string;
}) {
  const userId = await getAuthenticatedUserId();

  const account = await prisma.account.create({
    data: {
      userId,
      name: input.name,
      initialBalance: input.initialBalance,
      currency: input.currency,
    },
  });

  await redis.del(`user:${userId}:accounts`);
  revalidatePath("/dashboard/accounts");
  return serialize(account);
}
