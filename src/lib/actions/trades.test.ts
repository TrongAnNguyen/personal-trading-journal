import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the dependencies before importing the module under test
vi.mock("@/lib/db", () => ({
  prisma: {
    account: {
      findFirst: vi.fn(),
    },
    trade: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/redis", () => ({
  redis: {
    delPrefix: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("./utils", () => ({
  getAuthenticatedUserId: vi.fn(() => Promise.resolve("test-user-id")),
  // Mock createAction to just execute the handler directly and pass through the args
  createAction: (_config: any, handler: any) => {
    return async (input: any) => {
      // In tests, we manually pass the user ID as the second arg to the handler
      return handler(input, "test-user-id");
    };
  },
}));

// Now import after mocking
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { revalidatePath } from "next/cache";
import { AssetClass, TradeSide } from "@/types/trade";
import {
  createTrade,
  closeTrade,
  updateTrade,
  deleteTrade,
  getTrades,
  getTrade,
} from "./trades";

describe("Trade Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createTrade", () => {
    it("should create a trade if account belongs to user", async () => {
      // Setup mocks
      (prisma.account.findFirst as any).mockResolvedValue({
        id: "acc-1",
        userId: "test-user-id",
      });

      const mockCreatedTrade = {
        id: "trade-1",
        accountId: "acc-1",
        tags: [],
        checklist: [],
      };
      (prisma.trade.create as any).mockResolvedValue(mockCreatedTrade);

      const input = {
        accountId: "acc-1",
        symbol: "BTC",
        assetClass: AssetClass.CRYPTO,
        side: TradeSide.LONG,
        entryPrice: 50000,
        volume: 1,
        fees: 0,
        checklist: [] as { text: string; checked: boolean }[],
        tags: [] as string[],
      };

      const result = await createTrade(input);

      // Assertions
      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: { id: "acc-1", userId: "test-user-id" },
      });
      expect(prisma.trade.create).toHaveBeenCalled();
      expect(redis.delPrefix).toHaveBeenCalledWith("user:test-user-id:trades:");
      expect(revalidatePath).toHaveBeenCalledWith("/dashboard/trades");

      expect(result).toEqual(mockCreatedTrade);
    });

    it("should throw an error if account does not exist or unauthorized", async () => {
      // Account not found
      (prisma.account.findFirst as any).mockResolvedValue(null);

      const input = {
        accountId: "acc-2",
        symbol: "ETH",
        assetClass: AssetClass.CRYPTO,
        side: TradeSide.LONG,
        entryPrice: 3000,
        volume: 1,
        fees: 0,
        checklist: [] as { text: string; checked: boolean }[],
        tags: [] as string[],
      };

      await expect(createTrade(input)).rejects.toThrow(
        "Account not found or unauthorized",
      );
      expect(prisma.trade.create).not.toHaveBeenCalled();
    });
  });

  describe("closeTrade", () => {
    it("should throw error if trade does not exist or unauthorized", async () => {
      (prisma.trade.findFirst as any).mockResolvedValue(null);

      await expect(
        closeTrade({ tradeId: "trade-1", input: { exitPrice: 55000 } }),
      ).rejects.toThrow("Trade not found");
    });

    it("should calculate PnL and update trade status", async () => {
      const mockTrade = {
        id: "trade-1",
        entryPrice: 50000,
        volume: 1,
        side: "LONG",
        stopLoss: 48000,
      };

      (prisma.trade.findFirst as any).mockResolvedValue(mockTrade);
      (prisma.trade.update as any).mockResolvedValue({
        ...mockTrade,
        status: "CLOSED",
        tags: [],
      });

      await closeTrade({
        tradeId: "trade-1",
        input: { exitPrice: 55000 },
      });

      expect(prisma.trade.findFirst).toHaveBeenCalledWith({
        where: { id: "trade-1", account: { userId: "test-user-id" } },
      });

      expect(prisma.trade.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "trade-1" },
          data: expect.objectContaining({
            status: "CLOSED",
            exitPrice: 55000,
            pnl: expect.any(Number),
            riskReward: expect.any(Number),
          }),
        }),
      );
    });
  });

  describe("updateTrade", () => {
    it("should update trade if authorized", async () => {
      (prisma.trade.findFirst as any).mockResolvedValue({
        id: "trade-1",
        entryPrice: 100,
        volume: 1,
      });
      (prisma.trade.update as any).mockResolvedValue({
        id: "trade-1",
        tags: [],
      });

      await updateTrade({
        tradeId: "trade-1",
        input: { notes: "Updated notes" },
      });

      expect(prisma.trade.findFirst).toHaveBeenCalledWith({
        where: { id: "trade-1", account: { userId: "test-user-id" } },
      });
      expect(prisma.trade.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ notes: "Updated notes" }),
        }),
      );
    });

    it("should recalculate PnL if exitPrice is updated", async () => {
      (prisma.trade.findFirst as any).mockResolvedValue({
        id: "trade-1",
        entryPrice: 100,
        volume: 1,
        side: "LONG",
      });
      (prisma.trade.update as any).mockResolvedValue({
        id: "trade-1",
        tags: [],
      });

      await updateTrade({
        tradeId: "trade-1",
        input: { exitPrice: 110 },
      });

      expect(prisma.trade.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            exitPrice: 110,
            status: "CLOSED",
            pnl: expect.any(Number),
          }),
        }),
      );
    });
  });

  describe("deleteTrade", () => {
    it("should throw error if unauthorized", async () => {
      (prisma.trade.findFirst as any).mockResolvedValue(null);

      await expect(deleteTrade("trade-1")).rejects.toThrow(
        "Trade not found or unauthorized",
      );
      expect(prisma.trade.delete).not.toHaveBeenCalled();
    });

    it("should delete trade if authorized", async () => {
      (prisma.trade.findFirst as any).mockResolvedValue({ id: "trade-1" });
      (prisma.trade.delete as any).mockResolvedValue({ id: "trade-1" });

      await deleteTrade("trade-1");

      expect(prisma.trade.delete).toHaveBeenCalledWith({
        where: { id: "trade-1" },
      });
      expect(redis.delPrefix).toHaveBeenCalledWith("user:test-user-id:trades:");
    });
  });

  describe("getTrades", () => {
    it("should fetch trades from cache if available", async () => {
      const mockTrades = [{ id: "trade-1", symbol: "BTC" }];
      (redis.get as any).mockResolvedValue(mockTrades);

      const result = await getTrades();

      expect(result).toEqual(mockTrades);
      expect(prisma.trade.findMany).not.toHaveBeenCalled();
    });

    it("should query DB with user filter if cache misses", async () => {
      (redis.get as any).mockResolvedValue(null);
      const now = new Date();
      (prisma.trade.findMany as any).mockResolvedValue([
        {
          id: "trade-1",
          accountId: "acc-1",
          symbol: "BTC",
          entryPrice: 1,
          volume: 1,
          side: "LONG",
          assetClass: "CRYPTO",
          status: "OPEN",
          entryTime: now,
          createdAt: now,
          updatedAt: now,
          tags: [],
        },
      ]);

      await getTrades();

      expect(prisma.trade.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            account: { userId: "test-user-id" },
          }),
        }),
      );
      expect(redis.set).toHaveBeenCalled();
    });
  });

  describe("getTrade", () => {
    it("should fetch from DB ensuring user ownership", async () => {
      (redis.get as any).mockResolvedValue(null);
      const now = new Date();
      (prisma.trade.findFirst as any).mockResolvedValue({
        id: "trade-1",
        accountId: "acc-1",
        symbol: "BTC",
        entryPrice: 1,
        volume: 1,
        side: "LONG",
        assetClass: "CRYPTO",
        status: "OPEN",
        entryTime: now,
        createdAt: now,
        updatedAt: now,
        tags: [],
      });

      await getTrade("trade-1");

      expect(prisma.trade.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "trade-1", account: { userId: "test-user-id" } },
        }),
      );
    });
  });
});
