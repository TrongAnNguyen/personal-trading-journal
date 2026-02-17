import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Wallet } from "lucide-react";

interface Account {
  id: string;
  name: string;
  currency: string;
  initialBalance: any;
  createdAt: Date;
}

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: account.currency,
  }).format(Number(account.initialBalance));

  return (
    <Card className="transition-colors">
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
            <div className="text-2xl font-bold">{formattedBalance}</div>
            <p className="text-muted-foreground text-xs">Initial Balance</p>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>Created {format(new Date(account.createdAt), "PPP")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
