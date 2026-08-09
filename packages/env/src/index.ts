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

const KEY_PATTERN = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/;

export async function findWorkspaceRoot(start: string): Promise<string | null> {
  const { existsSync, readFileSync } = await import("node:fs");
  const { dirname, join, resolve } = await import("node:path");
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

let loaded = false;

export async function loadRootEnv(): Promise<void> {
  if (loaded) return;
  loaded = true;
  const { existsSync, readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const root = await findWorkspaceRoot(process.cwd());
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
