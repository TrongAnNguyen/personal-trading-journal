import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TradeForm } from "@/components/trade/trade-form";
import { ArrowLeft } from "lucide-react";
import { getAccounts } from "@/lib/actions/accounts";

export default async function NewTradePage() {
  const accounts = await getAccounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/trades">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Trade</h1>
          <p className="text-muted-foreground">Log a new trade entry</p>
        </div>
      </div>

      {/* Trade Form */}
      <TradeForm accounts={accounts} />
    </div>
  );
}
