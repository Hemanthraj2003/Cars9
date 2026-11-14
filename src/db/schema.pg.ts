import { pgTable, text, integer, serial, doublePrecision, boolean } from 'drizzle-orm/pg-core';

export const brands = pgTable('brands', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  logo: text('logo'),
});

export const subbrands = pgTable('subbrands', {
  id: serial('id').primaryKey(),
  brandId: text('brand_id')
    .notNull()
    .references(() => brands.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  years: text('years'), // JSON stringified array
});

export const parts = pgTable('parts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  subbrand: text('subbrand').notNull(),
  category: text('category').notNull().default('Accessories'),
  sku: text('sku').notNull(),
  description: text('description').notNull(),
  price: doublePrecision('price').notNull(),
  stock: integer('stock').notNull(),
  location: text('location').notNull(),
  imageUrl: text('image_url'),
  images: text('images'), // JSON stringified array
  videoUrl: text('video_url'),
  compatibleYears: text('compatible_years'), // JSON stringified array
  badge: text('badge'),
  warrantyMonths: integer('warranty_months').default(12),
  specifications: text('specifications'), // JSON stringified object
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: text('deleted_at'),
});

export const banners = pgTable('banners', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  badge: text('badge'),
  imageUrl: text('image_url').notNull(),
  ctaText: text('cta_text').default('Explore Accessories'),
  ctaLink: text('cta_link').default('#catalog'),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const quotations = pgTable('quotations', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  vehicleBrand: text('vehicle_brand'),
  vehicleModel: text('vehicle_model'),
  vehicleYear: text('vehicle_year'),
  items: text('items').notNull(), // JSON stringified array
  subtotal: doublePrecision('subtotal').default(0),
  laborTotal: doublePrecision('labor_total').default(0),
  discountAmount: doublePrecision('discount_amount').default(0),
  taxAmount: doublePrecision('tax_amount').default(0),
  grandTotal: doublePrecision('grand_total').default(0),
  isPriced: boolean('is_priced').default(false),
  notes: text('notes'),
  status: text('status').notNull().default('New Enquiry'),
  createdAt: text('created_at').notNull(),
});

export const warranties = pgTable('warranties', {
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
  warrantyMonths: integer('warranty_months').notNull().default(12),
  studioLocation: text('studio_location').notNull(),
  status: text('status').notNull().default('Active'),
});

export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
