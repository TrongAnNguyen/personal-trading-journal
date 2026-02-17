import type {
  Trade,
  TradeMetrics,
  EquityPoint,
  TradeSide,
} from "@/types/trade";

/**
 * Calculate Net PnL for a trade
 * Formula: PnL = (volume * (exitPrice / entryPrice - 1)) - fees
 * For SHORT: PnL = (volume * (1 - exitPrice / entryPrice)) - fees
 */
export function calculatePnL(trade: {
  entryPrice: number;
  exitPrice?: number | null;
  volume: number;
  fees?: number | null;
  side: TradeSide;
}): number | null {
  if (!trade.exitPrice) return null;

  const ratio = trade.exitPrice / trade.entryPrice;
  const pnlMultiplier = trade.side === "LONG" ? ratio - 1 : 1 - ratio;

  const grossPnL = trade.volume * pnlMultiplier;
  const fees = trade.fees ?? 0;

  return grossPnL - fees;
}

/**
 * Calculate Risk/Reward ratio
 * Formula: R/R = |exitPrice - entryPrice| / |entryPrice - stopLoss|
 */
export function calculateRiskReward(trade: {
  entryPrice: number;
  exitPrice?: number | null;
  stopLoss?: number | null;
}): number | null {
  if (!trade.exitPrice || !trade.stopLoss) return null;

  const reward = Math.abs(trade.exitPrice - trade.entryPrice);
  const risk = Math.abs(trade.entryPrice - trade.stopLoss);

  if (risk === 0) return null;

  return Number((reward / risk).toFixed(2));
}

/**
 * Calculate trading expectancy
 * Formula: E = (WinRate * AvgWin) - (LossRate * AvgLoss)
 */
export function calculateExpectancy(
  winRate: number,
  averageWin: number,
  averageLoss: number,
): number {
  const lossRate = 1 - winRate;
  return winRate * averageWin - lossRate * Math.abs(averageLoss);
}

/**
 * Calculate all performance metrics from a list of closed trades
 */
export function calculateMetrics(trades: Trade[]): TradeMetrics {
  const closedTrades = trades.filter(
    (t) => t.status === "CLOSED" && t.pnl != null,
  );

  if (closedTrades.length === 0) {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      profitFactor: 0,
      expectancy: 0,
      maxDrawdown: 0,
      averageWin: 0,
      averageLoss: 0,
      totalPnL: 0,
      averageRiskReward: 0,
    };
  }

  const winningTrades = closedTrades.filter((t) => (t.pnl ?? 0) > 0);
  const losingTrades = closedTrades.filter((t) => (t.pnl ?? 0) < 0);

  const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
  const totalLosses = Math.abs(
    losingTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0),
  );
  const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);

  const winRate = winningTrades.length / closedTrades.length;
  const averageWin =
    winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
  const averageLoss =
    losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins;

  // Calculate R/R average for trades with stopLoss
  const tradesWithRR = closedTrades.filter((t) => t.riskReward != null);
  const averageRiskReward =
    tradesWithRR.length > 0
      ? tradesWithRR.reduce((sum, t) => sum + (t.riskReward ?? 0), 0) /
        tradesWithRR.length
      : 0;

  return {
    totalTrades: closedTrades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate: Number((winRate * 100).toFixed(2)),
    profitFactor: Number(profitFactor.toFixed(2)),
    expectancy: Number(
      calculateExpectancy(winRate, averageWin, averageLoss).toFixed(2),
    ),
    maxDrawdown: calculateMaxDrawdown(closedTrades),
    averageWin: Number(averageWin.toFixed(2)),
    averageLoss: Number(averageLoss.toFixed(2)),
    totalPnL: Number(totalPnL.toFixed(2)),
    averageRiskReward: Number(averageRiskReward.toFixed(2)),
  };
}

/**
 * Calculate maximum drawdown from peak equity
 */
export function calculateMaxDrawdown(trades: Trade[]): number {
  const sortedTrades = [...trades]
    .filter((t) => t.exitTime != null)
    .sort(
      (a, b) =>
        new Date(a.exitTime!).getTime() - new Date(b.exitTime!).getTime(),
    );

  let peak = 0;
  let maxDrawdown = 0;
  let equity = 0;

  for (const trade of sortedTrades) {
    equity += trade.pnl ?? 0;
    if (equity > peak) {
      peak = equity;
    }
    const drawdown = peak - equity;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return Number(maxDrawdown.toFixed(2));
}

/**
 * Generate equity curve data points
 */
export function calculateEquityCurve(
  trades: Trade[],
  initialBalance: number,
): EquityPoint[] {
  const sortedTrades = [...trades]
    .filter((t) => t.status === "CLOSED" && t.exitTime != null)
    .sort(
      (a, b) =>
        new Date(a.exitTime!).getTime() - new Date(b.exitTime!).getTime(),
    );

  const points: EquityPoint[] = [
    {
      date: sortedTrades[0]?.entryTime ?? new Date(),
      equity: initialBalance,
      pnl: 0,
    },
  ];

  let currentEquity = initialBalance;

  for (const trade of sortedTrades) {
    const pnl = trade.pnl ?? 0;
    currentEquity += pnl;

    points.push({
      date: trade.exitTime!,
      equity: Number(currentEquity.toFixed(2)),
      pnl: Number(pnl.toFixed(2)),
      tradeId: trade.id,
    });
  }

  return points;
}

/**
 * Group trades by asset class
 */
export function groupTradesByAsset(
  trades: Trade[],
): Record<string, { count: number; pnl: number }> {
  return trades.reduce(
    (acc, trade) => {
      const key = trade.assetClass;
      if (!acc[key]) {
        acc[key] = { count: 0, pnl: 0 };
      }
      acc[key].count += 1;
      acc[key].pnl += trade.pnl ?? 0;
      return acc;
    },
    {} as Record<string, { count: number; pnl: number }>,
  );
}

/**
 * Group trades by emotion
 */
export function groupTradesByEmotion(
  trades: Trade[],
): Record<string, { count: number; pnl: number; winRate: number }> {
  const grouped = trades.reduce(
    (acc, trade) => {
      const key = trade.emotionEntry ?? "UNKNOWN";
      if (!acc[key]) {
        acc[key] = { count: 0, pnl: 0, wins: 0 };
      }
      acc[key].count += 1;
      acc[key].pnl += trade.pnl ?? 0;
      if ((trade.pnl ?? 0) > 0) acc[key].wins += 1;
      return acc;
    },
    {} as Record<string, { count: number; pnl: number; wins: number }>,
  );

  return Object.fromEntries(
    Object.entries(grouped).map(([key, value]) => [
      key,
      {
        count: value.count,
        pnl: Number(value.pnl.toFixed(2)),
        winRate: Number(((value.wins / value.count) * 100).toFixed(2)),
      },
    ]),
  );
}
