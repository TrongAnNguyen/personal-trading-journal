import { getAccounts } from "@/app/actions";
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
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Wallet className="h-5 w-5 text-muted-foreground" />
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
                  <p className="text-xs text-muted-foreground">
                    Initial Balance
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
          <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed rounded-lg text-muted-foreground">
            <Wallet className="h-12 w-12 mb-4 opacity-20" />
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
