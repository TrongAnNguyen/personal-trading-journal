# Project Requirement Document: Personalized Trading Journal

## 1. Project Overview

The goal is to develop a web-based **Trading Journal** application that helps traders move beyond simple spreadsheets. The platform will focus on discipline, psychological tracking, and advanced performance analytics to help users refine their strategies and achieve consistent profitability.

---

## 2. Functional Requirements

### A. Core Trade Management

- **Trade Logging:** A detailed form to capture:
- **Asset Details:** Ticker symbol, Asset Class (Crypto, Stocks, Forex), and Position Side (Long/Short).
- **Execution Data:** Entry/Exit prices, volume, fees, and timestamps.
- **Status:** Automatic toggle between "Open" and "Closed" positions.

- **Visual Evidence:** Support for uploading or linking screenshots (e.g., TradingView charts) for both entry and exit points.
- **Tagging System:** A multi-tag system to categorize trades by:
- **Strategy:** (e.g., Breakout, Mean Reversion).
- **Mistakes:** (e.g., FOMO, Revenge Trading, Early Exit).

### B. Analytics & Performance (The Dashboard)

- **Equity Curve:** A visual representation of account growth over time.
- **Key Metrics:**
- **Win Rate:** Percentage of profitable trades.
- **Profit Factor:** Ratio of gross profit to gross loss.
- **Max Drawdown:** The largest peak-to-trough decline.

- **Risk Analysis:** Automated calculation of Risk/Reward (R/R) ratios.

### C. Psychological & Discipline Tools

- **Pre-Trade Checklist:** A customizable list of rules that must be checked before a trade can be saved.
- **Emotion Tracking:** Logging emotional states (e.g., Neutral, Anxious, Overconfident) at the time of execution.
- **Post-Trade Review:** A dedicated markdown-supported text area for "lessons learned."

### D. Advanced Technical Features

- **Data Portability:** Import/Export functionality via CSV/JSON (supporting major brokers/exchanges).
- **Real-time Tracking:** Integration with pricing APIs (e.g., CoinGecko, Alpha Vantage) to track open PnL.
- **Automated Alerts:** Telegram/Browser notifications for "Over-trading" or "Stop-loss hit."

---

## 3. Data Schema (High-Level)

| Entity         | Description          | Key Fields                                                             |
| -------------- | -------------------- | ---------------------------------------------------------------------- |
| **User**       | Identity management  | `id`, `email`, `password_hash`, `settings_json`                        |
| **Account**    | Sub-portfolios       | `id`, `user_id`, `name`, `initial_balance`, `currency`                 |
| **Trade**      | The core transaction | `id`, `symbol`, `entry_price`, `exit_price`, `volume`, `pnl`, `status` |
| **Tag**        | Classification       | `id`, `name`, `type` (Strategy/Emotion)                                |
| **Attachment** | Visual proof         | `id`, `trade_id`, `image_url`, `context` (Entry/Exit)                  |

---

## 4. Mathematical Logic

The system will automatically calculate performance using the following formulas:

- **Net Profit/Loss:**
  $$PnL_{net} = (Volume \times (\frac{Price_{exit}}{Price_{entry}} - 1)) - Fees$$
- **Actual Risk/Reward Ratio:**
  $$R/R = \frac{|Price_{exit} - Price_{entry}|}{|Price_{entry} - Price_{stoploss}|}$$
- **Expectancy:**
  $$E = (WinRate \times AvgWin) - (LossRate \times AvgLoss)$$

---

## 5. Technical Stack (Proposed)

- **Frontend:** Next.js (React), Tailwind CSS, Shadcn/UI (for dashboard components), Modern UI/UX.
- **Backend:** Next.js Server Actions.
- **Database:** PostgreSQL (via Supabase).
- **ORM:** Prisma.
- **Authentication:** Supabase Auth.
- **Charts:** Recharts.

---

## 6. Future Roadmap

- **Trade Sharing:** Generate a public "read-only" link to share specific trades or performance with mentors.
- **AI Insights:** Use LLMs to analyze trade notes and identify recurring behavioral patterns or "blind spots."
- **Tax Reporting:** Automated tax gain/loss reporting based on specific regional rules.

---
