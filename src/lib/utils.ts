import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @deprecated Use schema-driven serialization (Zod) or native RSC serialization instead.
 * Recursively serializes a value to be safe for client-side transmission.
 * Converts Prisma Decimal to number. Keeps Date objects as is (Next.js RSC can handle them).
 */
export function serialize<T>(data: T): T {
  if (data === null || data === undefined) {
    return data as T;
  }

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map((item) => serialize(item)) as any;
  }

  // Handle Prisma Decimal (checks if it looks like a Decimal object)
  if (
    typeof data === "object" &&
    (data as any).toFixed &&
    (data as any).toNumber
  ) {
    return (data as any).toNumber();
  }

  // Handle Date objects - keep as is for Next.js RSC
  if (data instanceof Date) {
    return data as any;
  }

  // Handle Objects
  if (typeof data === "object") {
    const serialized: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        serialized[key] = serialize((data as any)[key]);
      }
    }
    return serialized;
  }

  return data;
}

/**
 * Recursively revives ISO date strings into Date objects.
 */
export function reviveDates(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle ISO Date strings
  if (
    typeof data === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(data)
  ) {
    return new Date(data);
  }

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map((item) => reviveDates(item));
  }

  // Handle Objects
  if (typeof data === "object") {
    const revived: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        revived[key] = reviveDates(data[key]);
      }
    }
    return revived;
  }

  return data;
}
