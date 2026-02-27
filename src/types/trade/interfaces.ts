import { z } from "zod";
import {
  tradeSchema,
  tagSchema,
  attachmentSchema,
  checklistItemSchema,
  accountSchema,
  userSchema,
} from "./schemas";

export type Trade = z.infer<typeof tradeSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type Attachment = z.infer<typeof attachmentSchema>;
export type ChecklistItem = z.infer<typeof checklistItemSchema>;
export type Account = z.infer<typeof accountSchema>;
export type User = z.infer<typeof userSchema>;
