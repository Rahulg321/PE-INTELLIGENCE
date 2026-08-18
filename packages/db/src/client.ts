import '@repo/env/load';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { relations } from './schema/relations';

export type Database = NodePgDatabase<typeof relations>;

let instance: Database | null = null;

/**
 * Initialize (or replace) the db instance from an explicit connection string.
 * Call this from a request handler on Cloudflare Workers — not at module
 * scope — because Hyperdrive I/O is disallowed during Worker startup.
 */
export function createDb(connectionString: string): Database {
  instance = drizzle(connectionString, { relations });
  return instance;
}

/**
 * Return the db instance, defaulting to `DATABASE_URL` from env for local/Node.
 */
export function getDb(): Database {
  if (!instance) {
    instance = drizzle(process.env.DATABASE_URL!, { relations });
  }
  return instance;
}

/**
 * Lazy singleton so `db` can be imported statically everywhere while still
 * working on Cloudflare, where the connection string only becomes available
 * once a request handler calls `createDb(env.HYPERDRIVE.connectionString)`.
 */
export const db: Database = new Proxy({} as Database, {
  get(_target, prop) {
    const database = getDb();
    const value = Reflect.get(database, prop);
    return typeof value === 'function' ? value.bind(database) : value;
  },
});
