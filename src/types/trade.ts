import { z } from "zod";

// ============================================================
// ENUMS (matching Prisma schema)
// ============================================================

export const AssetClass = {
  CRYPTO: "CRYPTO",
  STOCKS: "STOCKS",
  FOREX: "FOREX",
  FUTURES: "FUTURES",
  OPTIONS: "OPTIONS",
} as const;
export type AssetClass = (typeof AssetClass)[keyof typeof AssetClass];

export const TradeSide = {
  LONG: "LONG",
  SHORT: "SHORT",
} as const;
export type TradeSide = (typeof TradeSide)[keyof typeof TradeSide];

export const TradeStatus = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;
export type TradeStatus = (typeof TradeStatus)[keyof typeof TradeStatus];

export const Emotion = {
  NEUTRAL: "NEUTRAL",
  ANXIOUS: "ANXIOUS",
  OVERCONFIDENT: "OVERCONFIDENT",
  FEARFUL: "FEARFUL",
  GREEDY: "GREEDY",
  DISCIPLINED: "DISCIPLINED",
  FOMO: "FOMO",
  REVENGE: "REVENGE",
} as const;
export type Emotion = (typeof Emotion)[keyof typeof Emotion];

export const TagType = {
  STRATEGY: "STRATEGY",
  MISTAKE: "MISTAKE",
  SETUP: "SETUP",
  MARKET_CONDITION: "MARKET_CONDITION",
} as const;
export type TagType = (typeof TagType)[keyof typeof TagType];

export const AttachmentContext = {
  ENTRY: "ENTRY",
  EXIT: "EXIT",
  ANALYSIS: "ANALYSIS",
} as const;
export type AttachmentContext =
  (typeof AttachmentContext)[keyof typeof AttachmentContext];

// ============================================================
// ZOD SCHEMAS
// ============================================================

export const createTradeSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").max(20),
  assetClass: z.nativeEnum(AssetClass),
  side: z.nativeEnum(TradeSide),
  entryPrice: z.coerce.number().positive("Entry price must be positive"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  fees: z.coerce.number().min(0).optional().default(0),
  stopLoss: z.coerce.number().positive().optional(),
  takeProfit: z.coerce.number().positive().optional(),
  entryTime: z.coerce.date().optional(),
  emotionEntry: z.nativeEnum(Emotion).optional(),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.string().uuid()).optional().default([]),
  checklist: z
    .array(z.object({ text: z.string(), checked: z.boolean() }))
    .optional()
    .default([]),
});

export type CreateTradeInput = z.infer<typeof createTradeSchema>;

export const closeTradeSchema = z.object({
  exitPrice: z.coerce.number().positive("Exit price must be positive"),
  exitTime: z.coerce.date().optional(),
  fees: z.coerce.number().min(0).optional(),
  emotionExit: z.nativeEnum(Emotion).optional(),
  lessonsLearned: z.string().max(5000).optional(),
});

export type CloseTradeInput = z.infer<typeof closeTradeSchema>;

export const updateTradeSchema = createTradeSchema.partial().extend({
  exitPrice: z.coerce.number().positive().optional(),
  exitTime: z.coerce.date().optional(),
  emotionExit: z.nativeEnum(Emotion).optional(),
  lessonsLearned: z.string().max(5000).optional(),
});

export type UpdateTradeInput = z.infer<typeof updateTradeSchema>;

export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.nativeEnum(TagType),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

export const createAccountSchema = z.object({
  name: z.string().min(1).max(100),
  initialBalance: z.coerce.number().min(0),
  currency: z.string().length(3).default("USD"),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

// ============================================================
// TYPESCRIPT INTERFACES
// ============================================================

export interface Trade {
  id: string;
  accountId: string;
  symbol: string;
  assetClass: AssetClass;
  side: TradeSide;
  entryPrice: number;
  exitPrice?: number | null;
  quantity: number;
  fees?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  status: TradeStatus;
  entryTime: Date;
  exitTime?: Date | null;
  emotionEntry?: Emotion | null;
  emotionExit?: Emotion | null;
  notes?: string | null;
  lessonsLearned?: string | null;
  pnl?: number | null;
  riskReward?: number | null;
  tags?: Tag[];
  attachments?: Attachment[];
  checklist?: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  type: TagType;
  color?: string | null;
}

export interface Attachment {
  id: string;
  tradeId: string;
  imageUrl: string;
  context: AttachmentContext;
  caption?: string | null;
}

export interface ChecklistItem {
  id: string;
  tradeId: string;
  text: string;
  checked: boolean;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  initialBalance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  settings?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// METRICS TYPES
// ============================================================

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
