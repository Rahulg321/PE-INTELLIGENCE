import { describe, expect, test } from "bun:test";
import {
  googleScopes,
  hasSyncScopes,
  identityScope,
  needsGoogleGrant,
  parseScopes,
  signsInWithGoogle,
} from "./scopes";
import { env, isGoogleConfigured } from "./env";

describe("scopes", () => {
  test("parseScopes splits and trims", () => {
    expect(parseScopes("a b   c")).toEqual(["a", "b", "c"]);
    expect(parseScopes(null)).toEqual([]);
    expect(parseScopes("")).toEqual([]);
  });

  test("identityScope is openid email profile", () => {
    expect(identityScope).toBe("openid email profile");
  });

  test("hasSyncScopes detects sync scopes", () => {
    expect(hasSyncScopes("openid " + googleScopes[1])).toBe(true);
    expect(hasSyncScopes("openid email")).toBe(false);
  });

  test("needsGoogleGrant is true when a sync scope is missing", () => {
    expect(needsGoogleGrant("openid email profile")).toBe(true);
    expect(needsGoogleGrant(googleScopes.join(" "))).toBe(false);
  });

  test("signsInWithGoogle requires google provider + sync scopes", () => {
    expect(signsInWithGoogle({ providerId: "google", scope: googleScopes.join(" ") })).toBe(true);
    expect(signsInWithGoogle({ providerId: "github", scope: googleScopes.join(" ") })).toBe(false);
    expect(signsInWithGoogle({ providerId: "google", scope: "openid" })).toBe(false);
  });
});

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
