import { AccountList } from "@/components/accounts/account-list";
import { AccountListSkeleton } from "@/components/accounts/account-list-skeleton";
import { CreateAccountDialog } from "@/components/accounts/create-account-dialog";
import { Suspense } from "react";

export default async function AccountsPage() {
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

      <Suspense fallback={<AccountListSkeleton />}>
        <AccountList />
      </Suspense>
    </div>
  );
}
