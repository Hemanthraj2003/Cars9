import { mysqlTable, varchar, int, double, text, boolean } from 'drizzle-orm/mysql-core';

export const brands = mysqlTable('brands', {
  id: varchar('id', { length: 191 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  logo: text('logo_url'),
  rank: int('rank').default(0),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: text('deleted_at'),
});

export const subbrands = mysqlTable('subbrands', {
  id: int('id').autoincrement().primaryKey(),
  brandId: varchar('brand_id', { length: 191 })
    .notNull()
    .references(() => brands.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  imageUrl: text('image_url'),
  years: text('years'), // JSON stringified array of years
  rank: int('rank').default(0),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: text('deleted_at'),
});

export const parts = mysqlTable('parts', {
  id: varchar('id', { length: 191 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 191 }).notNull(),
  subbrand: varchar('subbrand', { length: 191 }).notNull(),
  sku: varchar('sku', { length: 191 }).notNull(),
  category: varchar('category', { length: 100 }).default('Accessories').notNull(),
  description: text('description').notNull(),
  price: double('price').notNull(),
  stock: int('stock').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  imageUrl: text('image_url'),
  images: text('images'), // JSON stringified array of image URLs
  videoUrl: text('video_url'),
  compatibleYears: text('compatible_years'), // JSON stringified array of years
  badge: varchar('badge', { length: 100 }),
  warrantyMonths: int('warranty_months').default(12),
  specifications: text('specifications'), // JSON stringified specifications
  rank: int('rank').default(0),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: text('deleted_at'),
});

export const banners = mysqlTable('banners', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: text('subtitle'),
  badge: varchar('badge', { length: 100 }),
  imageUrl: text('image_url').notNull(),
  ctaText: varchar('cta_text', { length: 100 }).default('Explore Accessories'),
  ctaLink: varchar('cta_link', { length: 255 }).default('#catalog'),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: int('sort_order').default(0).notNull(),
});

export const quotations = mysqlTable('quotations', {
  id: varchar('id', { length: 191 }).primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }),
  vehicleBrand: varchar('vehicle_brand', { length: 100 }),
  vehicleModel: varchar('vehicle_model', { length: 100 }),
  vehicleYear: varchar('vehicle_year', { length: 50 }),
  items: text('items').notNull(),
  subtotal: double('subtotal').default(0),
  laborTotal: double('labor_total').default(0),
  discountAmount: double('discount_amount').default(0),
  taxAmount: double('tax_amount').default(0),
  grandTotal: double('grand_total').default(0),
  isPriced: boolean('is_priced').default(false),
  notes: text('notes'),
  status: varchar('status', { length: 100 }).default('New Enquiry').notNull(),
  createdAt: varchar('created_at', { length: 100 }).notNull(),
});

export const warranties = mysqlTable('warranties', {
  id: varchar('id', { length: 191 }).primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }),
  invoiceNo: varchar('invoice_no', { length: 100 }).notNull(),
  vehicleRegNo: varchar('vehicle_reg_no', { length: 100 }).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  productId: varchar('product_id', { length: 100 }).notNull(),
  serialNumber: varchar('serial_number', { length: 100 }).notNull(),
  purchaseDate: varchar('purchase_date', { length: 50 }).notNull(),
  expiryDate: varchar('expiry_date', { length: 50 }).notNull(),
  warrantyMonths: int('warranty_months').default(12).notNull(),
  studioLocation: varchar('studio_location', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).default('Active').notNull(),
});

export const siteSettings = mysqlTable('site_settings', {
  key: varchar('key', { length: 191 }).primaryKey(),
  value: text('value').notNull(),
});

export const users = mysqlTable('users', {
  id: varchar('id', { length: 191 }).primaryKey(),
  username: varchar('username', { length: 191 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('admin').notNull(),
});
