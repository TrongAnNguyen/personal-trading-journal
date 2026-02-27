"use server";

import { CacheTTL } from "@/constants";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import {
  Account,
  accountSchema,
  createAccountSchema,
} from "@/types/trade";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { z } from "zod";
import { createAction, getAuthenticatedUserId } from "./utils";

export const getAccounts = cache(async function (): Promise<Account[]> {
  const userId = await getAuthenticatedUserId();

  const cacheKey = `user:${userId}:accounts`;

  try {
    const cached = await redis.get<Account[]>(cacheKey);
    if (cached) return cached;
  } catch (error) {
    console.error("Cache retrieval failed:", error);
  }

  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const serialized = z.array(accountSchema).parse(accounts) as Account[];

  try {
    await redis.set(cacheKey, serialized, CacheTTL.OneWeek);
  } catch (error) {
    console.error("Cache storage failed:", error);
  }

  return serialized;
});

export const createAccount = createAction(
  {
    input: createAccountSchema,
    output: accountSchema,
    authenticated: true,
  },
  async (input, userId) => {
    const account = await prisma.account.create({
      data: {
        userId: userId!,
        name: input.name,
        initialBalance: input.initialBalance,
        currency: input.currency,
      },
    });

    await redis.del(`user:${userId}:accounts`);
    revalidatePath("/dashboard/accounts");
    return account;
  },
);
