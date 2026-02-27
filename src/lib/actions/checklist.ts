"use server";

import { CacheTTL } from "@/constants";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import type { ChecklistTemplate } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUserId } from "./utils";

export async function getDisciplineChecklist(): Promise<ChecklistTemplate | null> {
  const userId = await getAuthenticatedUserId();

  const cacheKey = `user:${userId}:checklist-template`;

  try {
    const cached = await redis.get<ChecklistTemplate>(cacheKey);
    if (cached) return cached;
  } catch (error) {
    console.error("Redis error:", error);
  }

  const template = await prisma.checklistTemplate.findFirst({
    where: { userId },
  });

  if (!template) return null;

  try {
    await redis.set(cacheKey, template, CacheTTL.OneWeek);
  } catch (error) {
    console.error("Redis error:", error);
  }

  return template;
}

export async function updateDisciplineChecklist(items: string[]) {
  const userId = await getAuthenticatedUserId();

  const cacheKey = `user:${userId}:checklist-template`;

  const template = await prisma.checklistTemplate.findFirst({
    where: { userId },
  });

  let updatedTemplate;
  if (template) {
    updatedTemplate = await prisma.checklistTemplate.update({
      where: { id: template.id },
      data: { items },
    });
  } else {
    updatedTemplate = await prisma.checklistTemplate.create({
      data: {
        userId,
        items,
      },
    });
  }

  try {
    await redis.set(cacheKey, updatedTemplate, CacheTTL.OneWeek);
  } catch (error) {
    console.error("Redis error:", error);
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}
