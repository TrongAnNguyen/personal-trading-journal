import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TradeForm } from "@/components/trades/trade-form";
import { ArrowLeft } from "lucide-react";
import { getAccounts } from "@/lib/actions/accounts";
import { getDisciplineChecklist } from "@/lib/actions/checklist";

export const dynamic = "force-dynamic";

export default async function NewTradePage() {
  const [accounts, checklistTemplate] = await Promise.all([
    getAccounts(),
    getDisciplineChecklist(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6 border-b border-white/5 pb-6">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-none border-white/10"
          asChild
        >
          <Link href="/dashboard/trades">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-mono text-xl font-bold tracking-tighter uppercase">
            Execution_Input
          </h1>
          <p className="text-2.5 font-mono text-white/40 uppercase">
            Log new entry into the encrypted journal stream
          </p>
        </div>
      </div>

      {/* Trade Form */}
      <TradeForm
        accounts={accounts}
        initialChecklist={checklistTemplate?.items || []}
      />
    </div>
  );
}
