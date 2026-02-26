---
title: Breaking Data-Fetching Waterfalls
createdAt: '2026-02-26T01:59:51.394Z'
updatedAt: '2026-02-26T01:59:51.394Z'
description: >-
  Pattern for improving performance by breaking data-fetching waterfalls using
  Server Component containers and Suspense.
tags:
  - pattern
  - performance
  - nextjs
  - react-suspense
---
# Pattern: Breaking Data-Fetching Waterfalls

## Problem
In Next.js, using `await` at the top level of a Layout or Page can create a "waterfall" where the entire route is blocked from rendering until the data fetch completes. This leads to poor perceived performance, as the user sees a blank screen or a global loading state instead of the UI shell.

## Solution: The Container Pattern
Move data fetching from the Layout/Page into a dedicated "Container" Server Component. Wrap this container in a `Suspense` boundary with a `Skeleton` fallback. This allows the Layout shell and sibling components to render immediately.

### Key Benefits
- **Parallel Fetching**: Multiple containers fetch data in parallel.
- **Improved LCP/FCP**: The UI shell renders instantly.
- **Granular Loading States**: Each section of the page shows its own loading state.

## Implementation

### 1. The Container (Server Component)
```tsx
// components/feature/container.tsx
import { getData } from "@/lib/actions/feature";
import FeatureComponent from "./index";

export default async function FeatureContainer() {
  const data = await getData();
  return <FeatureComponent initialData={data} />;
}
```

### 2. The Skeleton (Client or Server)
```tsx
// components/feature/skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function FeatureSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
```

### 3. Usage in Layout/Page
```tsx
// app/dashboard/layout.tsx
import { Suspense } from "react";
import FeatureContainer from "@/components/feature/container";
import { FeatureSkeleton } from "@/components/feature/skeleton";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Suspense fallback={<FeatureSkeleton />}>
        <FeatureContainer />
      </Suspense>
      <main>{children}</main>
    </div>
  );
}
```

## Source
@task-e957wn
