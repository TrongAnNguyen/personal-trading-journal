"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

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

/**
 * Creates a type-safe server action with optional validation and authentication.
 */
export function createAction<
  TInputSchema extends z.ZodTypeAny | undefined,
  TOutputSchema extends z.ZodTypeAny | undefined,
>(
  options: {
    input?: TInputSchema;
    output?: TOutputSchema;
    authenticated?: boolean;
  },
  handler: (
    input: TInputSchema extends z.ZodTypeAny ? z.infer<TInputSchema> : any,
    userId?: string,
  ) => Promise<TOutputSchema extends z.ZodTypeAny ? any : any>,
) {
  return async (
    input: TInputSchema extends z.ZodTypeAny ? z.infer<TInputSchema> : any,
  ): Promise<
    ActionResponse<TOutputSchema extends z.ZodTypeAny ? z.infer<TOutputSchema> : any>
  > => {
    try {
      let userId: string | undefined;
      if (options.authenticated) {
        userId = await getAuthenticatedUserId();
      }

      const validatedInput = options.input ? options.input.parse(input) : input;
      const result = await handler(validatedInput, userId);
      const validatedOutput = options.output ? options.output.parse(result) : result;

      return { success: true, data: validatedOutput };
    } catch (error) {
      console.error("Action error:", error);
      return { success: false, error: (error as Error).message };
    }
  };
}
