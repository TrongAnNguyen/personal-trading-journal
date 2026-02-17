"use server";

import { CacheTTL } from "@/constants";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { serialize } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const getAccounts = cache(async function () {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const cacheKey = `user:${user.id}:accounts`;

  try {
    const cached = await redis.get<any[]>(cacheKey);
    if (cached) return cached;
  } catch (error) {
    console.error("Cache retrieval failed:", error);
  }

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
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

  await redis.del(`user:${user.id}:accounts`);
  revalidatePath("/dashboard/accounts");
  return serialize(account);
}
