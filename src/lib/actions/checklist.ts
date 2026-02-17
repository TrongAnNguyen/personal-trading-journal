"use server";

import { CacheTTL } from "@/constants";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { serialize } from "@/lib/utils";
import type { ChecklistTemplate } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getDisciplineChecklist(): Promise<ChecklistTemplate | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const cacheKey = `user:${user.id}:checklist-template`;

  try {
    const cached = await redis.get<ChecklistTemplate>(cacheKey);
    if (cached) return cached;
  } catch (error) {
    console.error("Redis error:", error);
  }

  const template = await prisma.checklistTemplate.findFirst({
    where: { userId: user.id },
  });

  const serialized = serialize(template) as ChecklistTemplate | null;

  try {
    if (serialized) {
      await redis.set(cacheKey, serialized, CacheTTL.OneWeek);
    }
  } catch (error) {
    console.error("Redis error:", error);
  }

  return serialized;
}

export async function updateDisciplineChecklist(items: string[]) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const cacheKey = `user:${user.id}:checklist-template`;

  const template = await prisma.checklistTemplate.findFirst({
    where: { userId: user.id },
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
        userId: user.id,
        items,
      },
    });
  }

  try {
    await redis.set(cacheKey, serialize(updatedTemplate), CacheTTL.OneWeek);
  } catch (error) {
    console.error("Redis error:", error);
    // Even if cache update fails, DB is updated, so we just log it
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}
