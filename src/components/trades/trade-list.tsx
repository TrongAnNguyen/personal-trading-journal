import { getTrades } from "@/lib/actions/trades";
import { TradeListTable } from "./trade-list-table";

export async function TradeList() {
  const trades = await getTrades();
  return <TradeListTable trades={trades} />;
}
