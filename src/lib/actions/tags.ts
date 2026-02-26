"use server";

import { CacheTTL } from "@/constants";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { serialize } from "@/lib/utils";
import { getAuthenticatedUserId } from "./utils";

export async function getTags() {
  const userId = await getAuthenticatedUserId();

  const cacheKey = `user:${userId}:tags`;

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
  const userId = await getAuthenticatedUserId();

  const tag = await prisma.tag.create({
    data: {
      name: input.name,
      type: input.type as "STRATEGY" | "MISTAKE" | "SETUP" | "MARKET_CONDITION",
      color: input.color,
    },
  });

  await redis.del(`user:${userId}:tags`);
  return serialize(tag);
}
