import { Decimal } from "@prisma/client/runtime/client";
import {
  AssetClass,
  TradeSide,
  TradeStatus,
  Emotion,
  TagType,
  AttachmentContext,
} from "./enums";

export interface Trade {
  id: string;
  accountId: string;
  symbol: string;
  assetClass: AssetClass;
  side: TradeSide;
  entryPrice: number;
  exitPrice?: number | null;
  volume: number;
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
  initialBalance: Decimal;
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
