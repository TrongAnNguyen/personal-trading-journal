import { AccountCard } from "@/components/accounts/account-card";
import { EmptyState } from "@/components/accounts/empty-state";
import { getAccounts } from "@/lib/actions/accounts";

export async function AccountList() {
  const accounts = await getAccounts();

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
