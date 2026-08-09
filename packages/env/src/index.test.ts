import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findWorkspaceRoot, parseEnv, loadRootEnv } from "./index";

describe("parseEnv", () => {
  test("parses simple key=value pairs", () => {
    const result = parseEnv("FOO=bar\nBAZ=qux\n");
    expect(result).toEqual({ FOO: "bar", BAZ: "qux" });
  });

  test("skips empty lines and comments", () => {
    const result = parseEnv("# comment\n\nFOO=bar\n  \n# another\nBAZ=qux");
    expect(result).toEqual({ FOO: "bar", BAZ: "qux" });
  });

  test("handles the export prefix", () => {
    const result = parseEnv("export FOO=bar\nexport BAZ=qux");
    expect(result).toEqual({ FOO: "bar", BAZ: "qux" });
  });

  test("allows whitespace around the equals sign", () => {
    const result = parseEnv("FOO = bar\n  BAZ  =  qux");
    expect(result).toEqual({ FOO: "bar", BAZ: "qux" });
  });

  test("strips matching single quotes", () => {
    const result = parseEnv("FOO='bar'");
    expect(result).toEqual({ FOO: "bar" });
  });

  test("strips matching double quotes", () => {
    const result = parseEnv('FOO="bar"');
    expect(result).toEqual({ FOO: "bar" });
  });

  test("unescapes \\n and \\r inside double quotes", () => {
    const result = parseEnv('FOO="line1\\nline2\\rline3"');
    expect(result).toEqual({ FOO: "line1\nline2\rline3" });
  });

  test("does not unescape inside single quotes", () => {
    const result = parseEnv("FOO='a\\nb'");
    expect(result).toEqual({ FOO: "a\\nb" });
  });

  test("strips inline comments for unquoted values", () => {
    const result = parseEnv("FOO=bar # trailing comment");
    expect(result).toEqual({ FOO: "bar" });
  });

  test("does not treat # without leading space as a comment", () => {
    const result = parseEnv("FOO=bar#not-a-comment");
    expect(result).toEqual({ FOO: "bar#not-a-comment" });
  });

  test("preserves a quoted value with a hash", () => {
    const result = parseEnv('FOO="bar#baz"');
    expect(result).toEqual({ FOO: "bar#baz" });
  });

  test("handles CRLF line endings", () => {
    const result = parseEnv("FOO=bar\r\nBAZ=qux\r\n");
    expect(result).toEqual({ FOO: "bar", BAZ: "qux" });
  });

  test("ignores lines that are not assignments", () => {
    const result = parseEnv("not-an-assignment\n=novalue\n123FOO=bar\n");
    expect(result).toEqual({});
  });
});

describe("findWorkspaceRoot", () => {
  test("returns null when no workspace is found", async () => {
    const dir = mkdtempSync(join(tmpdir(), "env-non-ws-"));
    try {
      expect(await findWorkspaceRoot(dir)).toBeNull();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("finds the nearest directory with a workspaces field", async () => {
    const root = mkdtempSync(join(tmpdir(), "env-ws-"));
    const nested = join(root, "apps", "web", "src");
    try {
      mkdirSync(nested, { recursive: true });
      writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root", workspaces: ["apps/*", "packages/*"] }));
      expect(await findWorkspaceRoot(nested)).toBe(root);
      expect(await findWorkspaceRoot(join(root, "apps"))).toBe(root);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("prefers the innermost workspaces field when nested", async () => {
    const root = mkdtempSync(join(tmpdir(), "env-ws-nested-"));
    const inner = join(root, "apps");
    try {
      mkdirSync(inner, { recursive: true });
      writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root", workspaces: ["apps/*"] }));
      writeFileSync(join(inner, "package.json"), JSON.stringify({ name: "apps", workspaces: ["*"] }));
      expect(await findWorkspaceRoot(join(inner, "web"))).toBe(inner);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("walks up through directories without a package.json", async () => {
    const root = mkdtempSync(join(tmpdir(), "env-ws2-"));
    const deep = join(root, "a", "b", "c");
    try {
      mkdirSync(deep, { recursive: true });
      writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root", workspaces: ["apps/*"] }));
      expect(await findWorkspaceRoot(deep)).toBe(root);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("ignores a malformed package.json and keeps walking", async () => {
    const root = mkdtempSync(join(tmpdir(), "env-ws3-"));
    const nested = join(root, "sub");
    try {
      mkdirSync(nested, { recursive: true });
      writeFileSync(join(nested, "package.json"), "not json");
      writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root", workspaces: ["sub"] }));
      expect(await findWorkspaceRoot(nested)).toBe(root);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("loadRootEnv", () => {
  const originalCwd = process.cwd();
  const originalEnv = { ...process.env };
  let root = "";
  let nested = "";

  beforeAll(async () => {
    root = mkdtempSync(join(tmpdir(), "env-load-"));
    nested = join(root, "packages", "app");
    mkdirSync(nested, { recursive: true });
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root", workspaces: ["packages/*"] }));
    writeFileSync(
      join(root, ".env"),
      [
        "SHARED=from-env",
        "ENV_ONLY=env-value",
        "REAL_WINS=env-value",
        "QUOTED=\"quoted value\"",
      ].join("\n"),
    );
    writeFileSync(
      join(root, ".env.local"),
      ["SHARED=from-local", "LOCAL_ONLY=local-value", "REAL_WINS=local-value"].join("\n"),
    );
    process.chdir(nested);
    process.env.REAL_WINS = "real-value";
    await loadRootEnv();
  });

  afterAll(() => {
    process.chdir(originalCwd);
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) delete process.env[key];
    }
    rmSync(root, { recursive: true, force: true });
  });

  test("loads the root .env file", () => {
    expect(process.env.ENV_ONLY).toBe("env-value");
  });

  test(".env.local overrides .env", () => {
    expect(process.env.SHARED).toBe("from-local");
  });

  test("parses quoted values from the file", () => {
    expect(process.env.QUOTED).toBe("quoted value");
  });

  test("real environment variables always win", () => {
    expect(process.env.REAL_WINS).toBe("real-value");
  });

  test("loads keys only present in .env.local", () => {
    expect(process.env.LOCAL_ONLY).toBe("local-value");
  });

  test("is idempotent and never throws when files are missing", async () => {
    const snapshot = { ...process.env };
    await expect(loadRootEnv()).resolves.toBeUndefined();
    expect(process.env).toEqual(snapshot);
  });
});
