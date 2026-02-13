import { getAccounts } from "@/lib/actions/accounts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import { CreateAccountDialog } from "./create-account-dialog";

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your trading accounts and portfolios
          </p>
        </div>
        <CreateAccountDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className="hover:bg-accent/5 transition-colors"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <Wallet className="text-muted-foreground h-5 w-5" />
                {account.name}
              </CardTitle>
              <Badge variant="outline">{account.currency}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: account.currency,
                    }).format(Number(account.initialBalance))}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Initial Balance
                  </p>
                </div>

                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created {format(new Date(account.createdAt), "PPP")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {accounts.length === 0 && (
          <div className="text-muted-foreground col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
            <Wallet className="mb-4 h-12 w-12 opacity-20" />
            <p>No accounts created yet.</p>
            <p className="text-sm">
              Add your first trading account to start logging trades.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
