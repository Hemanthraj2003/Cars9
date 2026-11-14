import path from 'path';

let dbInstance: any;

if (process.env.DB_HOST) {
  // -------------------------------------------------------------
  // Hostinger MySQL Mode (Production Studio Database)
  // -------------------------------------------------------------
  const { drizzle } = require('drizzle-orm/mysql2');
  const mysql = require('mysql2/promise');
  const mysqlSchema = require('./schema.mysql');

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });

  dbInstance = drizzle(pool, { schema: mysqlSchema, mode: 'default' });

} else if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
  // -------------------------------------------------------------
  // PostgreSQL Mode
  // -------------------------------------------------------------
  const databaseUrl = (process.env.DATABASE_URL || process.env.POSTGRES_URL)!;
  const { drizzle } = require('drizzle-orm/postgres-js');
  const pgPkg = require('postgres');
  const postgres = typeof pgPkg === 'function' ? pgPkg : pgPkg.default;
  const pgSchema = require('./schema.pg');

  const client = postgres(databaseUrl, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 15,
    ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1') ? false : 'require',
  });

  dbInstance = drizzle(client, { schema: pgSchema });

} else {
  // -------------------------------------------------------------
  // Local SQLite Fallback Mode
  // -------------------------------------------------------------
  const { drizzle } = require('drizzle-orm/better-sqlite3');
  const Database = require('better-sqlite3');
  const sqliteSchema = require('./schema.sqlite');

  const dbPath = path.join(process.cwd(), 'sqlite.db');
  const sqlite = new Database(dbPath);
  dbInstance = drizzle(sqlite, { schema: sqliteSchema });
}

export const db = dbInstance;
export const databaseType = process.env.DB_HOST ? 'mysql' : (process.env.DATABASE_URL ? 'postgres' : 'sqlite');
