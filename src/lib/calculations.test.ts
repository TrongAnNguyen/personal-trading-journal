import { describe, it, expect } from "vitest";
import {
  calculatePnL,
  calculateRiskReward,
  calculateExpectancy,
  calculateMetrics,
  calculateMaxDrawdown,
  calculateEquityCurve,
} from "./calculations";
import type { Trade } from "@/types/trade";

describe("calculations", () => {
  describe("calculatePnL", () => {
    it("should return null if exitPrice is missing", () => {
      expect(
        calculatePnL({
          entryPrice: 100,
          volume: 1,
          side: "LONG",
        }),
      ).toBeNull();
    });

    it("should calculate correct PnL for LONG trade without fees", () => {
      // PnL = (1 * (110 / 100 - 1)) - 0 = (1 * 0.1) = 0.1
      expect(
        calculatePnL({
          entryPrice: 100,
          exitPrice: 110,
          volume: 1,
          side: "LONG",
        }),
      ).toBeCloseTo(0.1);
    });

    it("should calculate correct PnL for SHORT trade without fees", () => {
      // PnL = (1 * (1 - 90 / 100)) = (1 * 0.1) = 0.1
      expect(
        calculatePnL({
          entryPrice: 100,
          exitPrice: 90,
          volume: 1,
          side: "SHORT",
        }),
      ).toBeCloseTo(0.1);
    });

    it("should deduct fees from PnL", () => {
      expect(
        calculatePnL({
          entryPrice: 100,
          exitPrice: 110,
          volume: 2,
          fees: 0.05,
          side: "LONG",
        }),
      ).toBeCloseTo(0.15); // (2 * 0.1) - 0.05 = 0.15
    });

    it("should handle negative PnL", () => {
      expect(
        calculatePnL({
          entryPrice: 100,
          exitPrice: 90,
          volume: 1,
          side: "LONG",
        }),
      ).toBeCloseTo(-0.1);
    });
  });

  describe("calculateRiskReward", () => {
    it("should return null if exitPrice or stopLoss is missing", () => {
      expect(
        calculateRiskReward({ entryPrice: 100, exitPrice: null, stopLoss: 90 }),
      ).toBeNull();
      expect(
        calculateRiskReward({
          entryPrice: 100,
          exitPrice: 110,
          stopLoss: null,
        }),
      ).toBeNull();
    });

    it("should return null if risk is zero (entryPrice === stopLoss)", () => {
      expect(
        calculateRiskReward({ entryPrice: 100, exitPrice: 110, stopLoss: 100 }),
      ).toBeNull();
    });

    it("should calculate correct risk/reward ratio", () => {
      expect(
        calculateRiskReward({ entryPrice: 100, exitPrice: 110, stopLoss: 90 }),
      ).toBe(1);

      expect(
        calculateRiskReward({ entryPrice: 100, exitPrice: 120, stopLoss: 95 }),
      ).toBe(4);
    });

    it("should format RR to 2 decimal places", () => {
      expect(
        calculateRiskReward({ entryPrice: 100, exitPrice: 110, stopLoss: 97 }),
      ).toBe(3.33);
    });
  });

  describe("calculateExpectancy", () => {
    it("should calculate correct expectancy", () => {
      expect(calculateExpectancy(0.6, 10, 5)).toBe(4);
    });

    it("should handle negative expectancy", () => {
      expect(calculateExpectancy(0.3, 5, 10)).toBe(-5.5);
    });
  });

  describe("calculateMetrics and calculateMaxDrawdown", () => {
    const mockTrades = [
      {
        status: "CLOSED",
        pnl: 100,
        riskReward: 2,
        exitTime: new Date("2023-01-01T10:00:00Z"),
      },
      {
        status: "CLOSED",
        pnl: -50,
        riskReward: null,
        exitTime: new Date("2023-01-02T10:00:00Z"),
      },
      {
        status: "CLOSED",
        pnl: 200,
        riskReward: 4,
        exitTime: new Date("2023-01-03T10:00:00Z"),
      },
      { status: "OPEN", pnl: null },
      {
        status: "CLOSED",
        pnl: -100,
        riskReward: 1,
        exitTime: new Date("2023-01-04T10:00:00Z"),
      },
    ] as any as Trade[];

    it("should calculate correct metrics for a list of trades", () => {
      const metrics = calculateMetrics(mockTrades);

      expect(metrics.totalTrades).toBe(4);
      expect(metrics.winningTrades).toBe(2);
      expect(metrics.losingTrades).toBe(2);
      expect(metrics.winRate).toBe(50);

      expect(metrics.profitFactor).toBe(2); // 300 / 150

      expect(metrics.averageWin).toBe(150);
      expect(metrics.averageLoss).toBe(75);

      expect(metrics.expectancy).toBe(37.5);
      expect(metrics.averageRiskReward).toBe(2.33);
      expect(metrics.totalPnL).toBe(150);
      expect(metrics.maxDrawdown).toBe(100);
    });

    it("should return empty metrics for no closed trades", () => {
      const metrics = calculateMetrics([
        { status: "OPEN", pnl: null },
      ] as Trade[]);

      expect(metrics.totalTrades).toBe(0);
      expect(metrics.winningTrades).toBe(0);
      expect(metrics.losingTrades).toBe(0);
      expect(metrics.winRate).toBe(0);
      expect(metrics.totalPnL).toBe(0);
    });
  });

  describe("calculateEquityCurve", () => {
    it("should calculate equity points correctly", () => {
      const mockTrades = [
        {
          id: "1",
          status: "CLOSED",
          pnl: 50,
          entryTime: new Date("2023-01-01T09:00:00Z"),
          exitTime: new Date("2023-01-01T10:00:00Z"),
        },
        {
          id: "2",
          status: "CLOSED",
          pnl: -20,
          entryTime: new Date("2023-01-02T09:00:00Z"),
          exitTime: new Date("2023-01-02T10:00:00Z"),
        },
      ] as any as Trade[];

      const curve = calculateEquityCurve(mockTrades, 1000);

      expect(curve.length).toBe(3);
      expect(curve[0].equity).toBe(1000);
      expect(curve[1].equity).toBe(1050);
      expect(curve[1].tradeId).toBe("1");
      expect(curve[2].equity).toBe(1030);
      expect(curve[2].tradeId).toBe("2");
    });
  });
});
