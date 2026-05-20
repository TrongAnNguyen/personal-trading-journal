"use server";
 
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changePasswordSchema } from "@/types/auth";
import { z } from "zod";
import { headers } from "next/headers";

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to sign out" };
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function updatePassword(
  formData: z.infer<typeof changePasswordSchema>,
) {
  const validated = changePasswordSchema.safeParse(formData);
  if (!validated.success) {
    return { error: "Invalid password data" };
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: validated.data.currentPassword,
        newPassword: validated.data.password,
      },
    });
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update password" };
  }
}

