"use server";

import { prisma } from "@/lib/db";
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

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return serialize(accounts);
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

  revalidatePath("/dashboard/accounts");
  return serialize(account);
}
