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
