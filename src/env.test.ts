import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const originalEnv = process.env;

describe("env validation", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should fail validation if required variables are missing", async () => {
    process.env.DATABASE_URL = undefined;
    
    await expect(import("./env")).rejects.toThrow();
  });

  it("should pass validation if all required variables are present and correct", async () => {
    process.env.DATABASE_URL = "postgres://localhost:5432/db";
    process.env.DIRECT_URL = "postgres://localhost:5432/db";
    process.env.CLOUDFLARE_KV_WORKER_URL = "https://example.workers.dev";
    process.env.BETTER_AUTH_SECRET = "a_very_long_secret_12345678";
    process.env.BETTER_AUTH_URL = "http://localhost:3000";
    process.env.NODE_ENV = "test";

    const { env } = await import("./env");
    expect(env.DATABASE_URL).toBe("postgres://localhost:5432/db");
    expect(env.DIRECT_URL).toBe("postgres://localhost:5432/db");
    expect(env.CLOUDFLARE_KV_WORKER_URL).toBe("https://example.workers.dev");
    expect(env.BETTER_AUTH_SECRET).toBe("a_very_long_secret_12345678");
    expect(env.BETTER_AUTH_URL).toBe("http://localhost:3000");
  });
});
