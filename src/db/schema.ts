import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const brands = sqliteTable('brands', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const subbrands = sqliteTable('subbrands', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  brandId: text('brand_id')
    .notNull()
    .references(() => brands.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
});

export const parts = sqliteTable('parts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  subbrand: text('subbrand').notNull(),
  sku: text('sku').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  stock: integer('stock', { mode: 'number' }).notNull(),
  location: text('location').notNull(),
  imageUrl: text('image_url'),
  
  // Specifications JSON stored as text
  specifications: text('specifications', { mode: 'json' }),
});
