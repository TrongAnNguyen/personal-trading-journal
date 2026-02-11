"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changePasswordSchema } from "@/types/auth";
import { z } from "zod";

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function updatePassword(formData: z.infer<typeof changePasswordSchema>) {
  const validated = changePasswordSchema.safeParse(formData);
  if (!validated.success) {
    return { error: "Invalid password data" };
  }

  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase.auth.updateUser({
    password: validated.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
