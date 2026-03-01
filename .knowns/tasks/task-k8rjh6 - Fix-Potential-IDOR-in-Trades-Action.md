---
id: k8rjh6
title: Fix Potential IDOR in Trades Action
status: done
priority: high
labels:
  - security
createdAt: '2026-03-01T03:24:52.474Z'
updatedAt: '2026-03-01T03:29:57.026Z'
timeSpent: 0
---
# Fix Potential IDOR in Trades Action

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
getTrade and updateTrade fetch/modify records by id without explicitly including userId in the Prisma where clause in src/lib/actions/trades.ts. Always include userId in Prisma queries: prisma.trade.findUnique({ where: { id, userId } }).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Ensure userId is explicitly included in Prisma where clause for getTrade and updateTrade
- [x] #2 Verify fix prevents unauthorized access to trades
<!-- AC:END -->

