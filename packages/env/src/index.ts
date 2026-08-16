import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/** Key/value pairs owned by a dotenv file: every declared key maps to its literal string value. */
export interface EnvFileValues {
  [key: string]: string;
}

export function parseEnv(source: string): EnvFileValues {
  const result: EnvFileValues = {};
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = KEY_PATTERN.exec(line);
    if (!match) continue;
    const key = match[1]!;
    let value = match[2]!;
    const quote = value[0];
    if (quote === '"' || quote === "'") {
      const end = value.lastIndexOf(quote);
      if (end > 0) {
        value = value.slice(1, end);
        if (quote === '"') {
          value = value.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
        }
      }
    } else {
      const commentIndex = value.indexOf(" #");
      if (commentIndex !== -1) value = value.slice(0, commentIndex);
      value = value.trim();
    }
    result[key] = value;
  }
  return result;
}

const KEY_PATTERN = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/;

/** The only `package.json` field this module reads: its presence as an array marks a workspace root. */
interface PackageManifest {
  readonly workspaces?: unknown;
}

export function findWorkspaceRoot(start: string): string | null {
  let dir = resolve(start);
  for (;;) {
    const pkgPath = join(dir, "package.json");
    let isWorkspace = false;
    if (existsSync(pkgPath)) {
      try {
        // SAFETY: `JSON.parse` yields `any` for an unvalidated file. `PackageManifest`
        // narrows it to a single optional field left as `unknown`, so the only read
        // below still has to prove its own shape via `Array.isArray`.
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as PackageManifest;
        isWorkspace = Array.isArray(pkg.workspaces);
      } catch {
        // ignore malformed package.json
      }
    }
    if (isWorkspace) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

let loaded = false;

export function loadRootEnv(): void {
  if (loaded) return;
  loaded = true;
  const root = findWorkspaceRoot(process.cwd());
  if (!root) return;
  const merged: EnvFileValues = {};
  for (const filename of [".env", ".env.local"]) {
    const filePath = join(root, filename);
    if (!existsSync(filePath)) continue;
    const content = readFileSync(filePath, "utf8");
    Object.assign(merged, parseEnv(content));
  }
  for (const [key, value] of Object.entries(merged)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
