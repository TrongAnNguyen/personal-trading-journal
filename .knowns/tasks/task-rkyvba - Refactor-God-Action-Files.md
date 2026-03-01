---
id: rkyvba
title: Refactor God Action Files
status: todo
priority: medium
labels:
  - tech-debt
  - refactoring
createdAt: '2026-03-01T03:24:52.509Z'
updatedAt: '2026-03-01T03:25:01.998Z'
timeSpent: 0
---
# Refactor God Action Files

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
trades.ts and knowledge-base.ts are becoming large and handle validation, DB logic, caching, and revalidation. Extract database logic into service classes/functions and keep actions focused on request handling.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Extract database logic from trades.ts and knowledge-base.ts into a service layer
- [ ] #2 Ensure actions only handle request validation, response formatting, and service calling
<!-- AC:END -->

