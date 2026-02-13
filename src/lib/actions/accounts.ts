"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAccounts() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

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

  revalidatePath("/dashboard/accounts");
  return account;
}
