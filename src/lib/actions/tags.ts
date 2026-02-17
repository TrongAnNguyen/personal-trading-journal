"use server";

import { CacheTTL } from "@/constants";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { serialize } from "@/lib/utils";

export async function getTags() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const cacheKey = `user:${user.id}:tags`;

  try {
    const cached = await redis.get<any[]>(cacheKey);
    if (cached) return cached;
  } catch (error) {
    console.error("Cache retrieval failed:", error);
  }

  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  const serialized = serialize(tags);

  try {
    await redis.set(cacheKey, serialized, CacheTTL.OneWeek);
  } catch (error) {
    console.error("Cache storage failed:", error);
  }

  return serialized;
}

export async function createTag(input: {
  name: string;
  type: string;
  color?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const tag = await prisma.tag.create({
    data: {
      name: input.name,
      type: input.type as "STRATEGY" | "MISTAKE" | "SETUP" | "MARKET_CONDITION",
      color: input.color,
    },
  });

  await redis.del(`user:${user.id}:tags`);
  return serialize(tag);
}
