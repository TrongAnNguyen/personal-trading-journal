import { AccountCard } from "@/components/accounts/account-card";
import { EmptyState } from "@/components/accounts/empty-state";
import { getAccounts } from "@/lib/actions/accounts";
import { cache } from "react";

export async function AccountList() {
  const accounts = await getAccountsCached();

  if (accounts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}

const getAccountsCached = cache(async () => {
  const accounts = await getAccounts();
  return accounts;
});
