// pronto/packages/db/setup.js
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';

export default function setup({ filePath }) {
  const sqlite = new Database(filePath);
  const db = drizzle(sqlite, { schema });
  return { db, schema };
}