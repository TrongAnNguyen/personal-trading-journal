"use server";

import { prisma } from "@/lib/db";

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
