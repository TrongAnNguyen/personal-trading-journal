"use server";

import { CacheTTL } from "@/constants";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { createTagSchema, tagSchema } from "@/types/trade";
import { z } from "zod";
import { createAction, getAuthenticatedUserId } from "./utils";

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

  const serialized = z.array(tagSchema).parse(tags);

  try {
    await redis.set(cacheKey, serialized, CacheTTL.OneWeek);
  } catch (error) {
    console.error("Cache storage failed:", error);
  }

  return serialized;
}

export const createTag = createAction(
  {
    input: createTagSchema,
    output: tagSchema,
    authenticated: true,
  },
  async (input, userId) => {
    const tag = await prisma.tag.create({
      data: {
        name: input.name,
        type: input.type,
        color: input.color,
      },
    });

    await redis.del(`user:${userId}:tags`);
    return tag;
  },
);
