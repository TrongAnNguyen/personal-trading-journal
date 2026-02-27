"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { createTrade } from "@/lib/actions/trades";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  type Account,
  type CreateTradeInput,
  createTradeSchema,
} from "@/types/trade";
import { useRouter } from "next/navigation";
import { AssetDetails } from "./form/asset-details";
import { ExecutionData } from "./form/execution-data";
import { Psychology } from "./form/psychology";
import { TagsAndChecklist } from "./form/tags-checklist";

interface TradeFormProps {
  accounts: Account[];
  initialChecklist?: string[];
}

export function TradeForm({ accounts, initialChecklist = [] }: TradeFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const hasAccounts = accounts.length > 0;

  const form = useForm<z.input<typeof createTradeSchema>>({
    resolver: zodResolver(createTradeSchema),
    defaultValues: {
      accountId: accounts.length === 1 ? accounts[0].id : "",
      symbol: "",
      assetClass: "CRYPTO",
      side: "LONG",
      entryPrice: "" as unknown as number,
      volume: "" as unknown as number,
      fees: 0,
      stopLoss: undefined,
      takeProfit: undefined,
      emotionEntry: undefined,
      notes: "",
      tags: [],
      checklist: initialChecklist.map((text) => ({ text, checked: false })),
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const result = await createTrade(data as CreateTradeInput);
        if (result.success) {
          form.reset();
          router.push("/dashboard/trades");
        } else {
          console.error("Failed to create trade:", result.error);
        }
      } catch (error) {
        console.error("Failed to create trade:", error);
      }
    });
  });

  const selectedSide = form.watch("side");

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <AssetDetails accounts={accounts} hasAccounts={hasAccounts} />
        <ExecutionData disabled={!hasAccounts} />
        <Psychology disabled={!hasAccounts} />
        <TagsAndChecklist />

        <Separator />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending || !hasAccounts}
            className="border-white/10 font-bold"
          >
            RESET_BUFFER
          </Button>
          <Button
            type="submit"
            disabled={isPending || !hasAccounts}
            className={
              selectedSide === "LONG"
                ? "bg-profit hover:bg-profit/90 font-bold text-black"
                : "bg-loss hover:bg-loss/90 font-bold text-white"
            }
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                EXECUTING...
              </>
            ) : (
              <>
                INITIATE {selectedSide === "LONG" ? "LONG" : "SHORT"} POSITION
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
