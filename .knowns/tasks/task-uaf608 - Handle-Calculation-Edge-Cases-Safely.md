---
id: uaf608
title: Handle Calculation Edge Cases Safely
status: todo
priority: medium
labels:
  - tech-debt
createdAt: '2026-03-01T03:24:52.535Z'
updatedAt: '2026-03-01T03:25:02.042Z'
timeSpent: 0
---
# Handle Calculation Edge Cases Safely

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Calculation functions in src/lib/calculations.ts return null when data like exitPrice or stopLoss is missing. Ensure all consuming UI components (charts, metrics cards) explicitly handle null values to avoid NaN or runtime crashes.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Ensure calculations correctly return null or fallback values when inputs are missing
- [ ] #2 Update UI components to explicitly check for and handle null calculation outputs gracefully
<!-- AC:END -->

