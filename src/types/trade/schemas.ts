import { z } from "zod";
import { AssetClass, TradeSide, Emotion, TagType, TradeStatus } from "./enums";

export const createTradeSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  symbol: z.string().min(1, "Symbol is required").max(20),
  assetClass: z.nativeEnum(AssetClass),
  side: z.nativeEnum(TradeSide),
  entryPrice: z.coerce.number().positive("Entry price must be positive"),
  volume: z.coerce.number().positive("Volume must be positive"),
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

// --- Output Schemas ---

export const decimalSchema = z.preprocess((val) => {
  if (typeof val === "object" && val && "toNumber" in (val as any)) {
    return (val as any).toNumber();
  }
  return val;
}, z.number());

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(TagType),
  color: z.string().nullable().optional(),
});

export const checklistItemSchema = z.object({
  id: z.string(),
  tradeId: z.string(),
  text: z.string(),
  checked: z.boolean(),
});

export const attachmentSchema = z.object({
  id: z.string(),
  tradeId: z.string(),
  imageUrl: z.string(),
  context: z.string(),
  caption: z.string().nullable().optional(),
});

export const tradeSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  symbol: z.string(),
  assetClass: z.nativeEnum(AssetClass),
  side: z.nativeEnum(TradeSide),
  entryPrice: decimalSchema,
  exitPrice: decimalSchema.nullable().optional(),
  volume: decimalSchema,
  fees: decimalSchema.nullable().optional(),
  stopLoss: decimalSchema.nullable().optional(),
  takeProfit: decimalSchema.nullable().optional(),
  status: z.nativeEnum(TradeStatus),
  entryTime: z.date(),
  exitTime: z.date().nullable().optional(),
  emotionEntry: z.nativeEnum(Emotion).nullable().optional(),
  emotionExit: z.nativeEnum(Emotion).nullable().optional(),
  notes: z.string().nullable().optional(),
  lessonsLearned: z.string().nullable().optional(),
  pnl: decimalSchema.nullable().optional(),
  riskReward: decimalSchema.nullable().optional(),
  tags: z.array(tagSchema).optional(),
  checklist: z.array(checklistItemSchema).optional(),
  attachments: z.array(attachmentSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const accountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  initialBalance: decimalSchema,
  currency: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
