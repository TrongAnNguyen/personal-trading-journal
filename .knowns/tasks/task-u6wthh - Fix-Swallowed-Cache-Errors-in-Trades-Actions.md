---
id: u6wthh
title: Fix Swallowed Cache Errors in Trades Actions
status: todo
priority: medium
labels:
  - tech-debt
createdAt: '2026-03-01T03:24:51.861Z'
updatedAt: '2026-03-01T03:25:01.889Z'
timeSpent: 0
---
# Fix Swallowed Cache Errors in Trades Actions

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Redis errors are caught and logged but not bubbled up in src/lib/actions/trades.ts (getTrades and getTrade). Implement a more robust error boundary or fallback strategy for the caching layer.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Implement error boundary or fallback for cache failures in getTrades and getTrade
<!-- AC:END -->

