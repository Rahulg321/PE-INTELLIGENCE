import { describe, expect, test } from "bun:test";
import { env, isGoogleConfigured } from "./env";

describe("env", () => {
  test("isGoogleConfigured requires both keys", () => {
    const originalId = process.env.GOOGLE_CLIENT_ID;
    const originalSecret = process.env.GOOGLE_CLIENT_SECRET;
    try {
      process.env.GOOGLE_CLIENT_ID = "id";
      process.env.GOOGLE_CLIENT_SECRET = "";
      expect(isGoogleConfigured()).toBe(false);
      process.env.GOOGLE_CLIENT_SECRET = "secret";
      expect(isGoogleConfigured()).toBe(true);
    } finally {
      process.env.GOOGLE_CLIENT_ID = originalId;
      process.env.GOOGLE_CLIENT_SECRET = originalSecret;
    }
  });

  test("env object is frozen and exposes derived urls", () => {
    expect(Object.isFrozen(env)).toBe(true);
    expect(env.apiUrl.length).toBeGreaterThan(0);
    expect(env.trustedOrigins).toContain(env.apiUrl);
  });
});
