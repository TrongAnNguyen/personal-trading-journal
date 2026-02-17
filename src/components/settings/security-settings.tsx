"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePassword } from "@/app/auth/actions";
import { changePasswordSchema, type ChangePasswordInput } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function SecuritySettings() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onUpdatePassword = async (data: ChangePasswordInput) => {
    setMessage(null);
    startTransition(async () => {
      const result = await updatePassword(data);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Password updated successfully" });
        form.reset();
      }
    });
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`flex items-center gap-3 rounded-md p-4 mb-4 ${
            message.type === "success"
              ? "bg-primary/10 text-primary border-primary/20 border"
              : "bg-destructive/10 text-destructive border-destructive/20 border"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onUpdatePassword)}
          className="max-w-md space-y-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase">New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••"
                    {...field}
                    className="bg-black/40 border-white/10 rounded-none h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase">Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••"
                    {...field}
                    className="bg-black/40 border-white/10 rounded-none h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="font-bold">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "UPDATE_PROTOCOL"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
