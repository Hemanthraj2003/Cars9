import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Specify the path to the sqlite file
const dbPath = path.join(process.cwd(), 'sqlite.db');

// Initialize better-sqlite3
const sqlite = new Database(dbPath);

// Initialize drizzle
export const db = drizzle(sqlite, { schema });
