import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const brands = sqliteTable('brands', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  logo: text('logo'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  deletedAt: text('deleted_at'),
});

export const subbrands = sqliteTable('subbrands', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  brandId: text('brand_id')
    .notNull()
    .references(() => brands.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  years: text('years', { mode: 'json' }),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  deletedAt: text('deleted_at'),
});

export const parts = sqliteTable('parts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  subbrand: text('subbrand').notNull(),
  category: text('category').notNull().default('Accessories'),
  sku: text('sku').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  stock: integer('stock', { mode: 'number' }).notNull(),
  location: text('location').notNull(),
  imageUrl: text('image_url'),
  images: text('images', { mode: 'json' }),
  videoUrl: text('video_url'),
  compatibleYears: text('compatible_years', { mode: 'json' }),
  badge: text('badge'),
  warrantyMonths: integer('warranty_months', { mode: 'number' }).default(12),
  specifications: text('specifications', { mode: 'json' }),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  deletedAt: text('deleted_at'),
});

export const banners = sqliteTable('banners', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  badge: text('badge'),
  imageUrl: text('image_url').notNull(),
  ctaText: text('cta_text').default('Explore Accessories'),
  ctaLink: text('cta_link').default('#catalog'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer('sort_order', { mode: 'number' }).notNull().default(0),
});

export const quotations = sqliteTable('quotations', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  vehicleBrand: text('vehicle_brand'),
  vehicleModel: text('vehicle_model'),
  vehicleYear: text('vehicle_year'),
  items: text('items', { mode: 'json' }).notNull(),
  subtotal: real('subtotal').default(0),
  laborTotal: real('labor_total').default(0),
  discountAmount: real('discount_amount').default(0),
  taxAmount: real('tax_amount').default(0),
  grandTotal: real('grand_total').default(0),
  isPriced: integer('is_priced', { mode: 'boolean' }).default(false),
  notes: text('notes'),
  status: text('status').notNull().default('New Enquiry'),
  createdAt: text('created_at').notNull(),
});

export const warranties = sqliteTable('warranties', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  invoiceNo: text('invoice_no').notNull(),
  vehicleRegNo: text('vehicle_reg_no').notNull(),
  productName: text('product_name').notNull(),
  productId: text('product_id').notNull(),
  serialNumber: text('serial_number').notNull(),
  purchaseDate: text('purchase_date').notNull(),
  expiryDate: text('expiry_date').notNull(),
  warrantyMonths: integer('warranty_months', { mode: 'number' }).notNull().default(12),
  studioLocation: text('studio_location').notNull(),
  status: text('status').notNull().default('Active'),
});

export const siteSettings = sqliteTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
