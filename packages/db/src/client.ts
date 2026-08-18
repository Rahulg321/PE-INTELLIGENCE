import '@repo/env/load';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Client } from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { relations } from './schema/relations';

export type Database = NodePgDatabase<typeof relations>;

const als = new AsyncLocalStorage<Database>();
let processDb: Database | null = null;

function fromUrl(connectionString: string): Database {
  return drizzle(connectionString, { relations });
}

/**
 * Run `fn` with a request-scoped Postgres client.
 * Required on Cloudflare Workers: Hyperdrive I/O cannot be cached across requests.
 */
export async function withDb<T>(
  connectionString: string,
  fn: () => T | Promise<T>,
): Promise<T> {
  const client = new Client({ connectionString });
  await client.connect();
  const database = drizzle({ client, relations });
  try {
    return await als.run(database, fn);
  } finally {
    await client.end();
  }
}

/**
 * Return the db instance. Prefers the request-scoped client from `withDb`,
 */
export function getDb(): Database {
  const requestDb = als.getStore();
  if (requestDb) return requestDb;
  if (!processDb) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'Database is not initialized. In Workers, wrap the request with withDb(env.HYPERDRIVE.connectionString, ...). In Node, set DATABASE_URL.',
      );
    }
    processDb = fromUrl(url);
  }
  return processDb;
}

/**
 * Lazy singleton so `db` can be imported statically everywhere.
 */
export const db: Database = new Proxy({} as Database, {
  get(_target, prop) {
    const database = getDb();
    const value = Reflect.get(database, prop);
    return typeof value === 'function' ? value.bind(database) : value;
  },
});
