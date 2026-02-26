"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return user.id;
}
