import * as mysqlSchema from './schema.mysql';
import * as pgSchema from './schema.pg';
import * as sqliteSchema from './schema.sqlite';

const isMysql = Boolean(process.env.DB_HOST);
const isPg = !isMysql && Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);

const activeSchema: any = isMysql ? mysqlSchema : isPg ? pgSchema : sqliteSchema;

export const brands = activeSchema.brands;
export const subbrands = activeSchema.subbrands;
export const parts = activeSchema.parts;
export const banners = activeSchema.banners;
export const quotations = activeSchema.quotations;
export const warranties = activeSchema.warranties;
export const siteSettings = activeSchema.siteSettings;
export const users = activeSchema.users;
