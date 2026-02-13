export interface TradeMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  expectancy: number;
  maxDrawdown: number;
  averageWin: number;
  averageLoss: number;
  totalPnL: number;
  averageRiskReward: number;
}

export interface EquityPoint {
  date: Date;
  equity: number;
  pnl: number;
  tradeId?: string;
}
