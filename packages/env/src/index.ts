import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export function findWorkspaceRoot(start: string): string | null {
  let dir = resolve(start);
  for (;;) {
    const pkgPath = join(dir, "package.json");
    let isWorkspace = false;
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { workspaces?: unknown };
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

const KEY_PATTERN = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/;

export function parseEnv(source: string): Record<string, string> {
  const result: Record<string, string> = {};
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

let loaded = false;

export function loadRootEnv(): void {
  if (loaded) return;
  loaded = true;
  const root = findWorkspaceRoot(process.cwd());
  if (!root) return;
  const merged: Record<string, string> = {};
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
