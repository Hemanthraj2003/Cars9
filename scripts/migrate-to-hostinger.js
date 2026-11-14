require('dotenv').config({ path: '.env.local' });
const path = require('path');
const Database = require('better-sqlite3');
const mysql = require('mysql2/promise');

async function migrate() {
  console.log("=================================================");
  console.log("  CARS9: MIGRATING DATA TO HOSTINGER MYSQL       ");
  console.log("=================================================\n");

  const sqlitePath = path.join(process.cwd(), 'sqlite.db');
  console.log(`1. Reading local SQLite: ${sqlitePath}`);
  const sqlite = new Database(sqlitePath);

  console.log(`2. Connecting to Hostinger MySQL (${process.env.DB_HOST})...`);
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // 1. Migrate Brands
  const brands = sqlite.prepare('SELECT * FROM brands').all();
  console.log(`3. Migrating ${brands.length} Brands...`);
  for (const b of brands) {
    await conn.query(
      `INSERT INTO brands (id, name, logo_url, \`rank\`)
       VALUES (?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE name = VALUES(name), logo_url = VALUES(logo_url)`,
      [b.id, b.name, b.logo || null]
    );
  }

  // 2. Migrate Subbrands
  const subbrands = sqlite.prepare('SELECT * FROM subbrands').all();
  console.log(`4. Migrating ${subbrands.length} Subbrands / Vehicle Models...`);
  for (const sb of subbrands) {
    const yearsStr = typeof sb.years === 'string' ? sb.years : JSON.stringify(sb.years || []);
    await conn.query(
      `INSERT INTO subbrands (id, brand_id, name, years, \`rank\`)
       VALUES (?, ?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE brand_id = VALUES(brand_id), name = VALUES(name), years = VALUES(years)`,
      [sb.id, sb.brand_id, sb.name, yearsStr]
    );
  }

  // 3. Migrate Parts
  const parts = sqlite.prepare('SELECT * FROM parts').all();
  console.log(`5. Migrating ${parts.length} Products & Accessories...`);
  for (const p of parts) {
    const imagesStr = typeof p.images === 'string' ? p.images : JSON.stringify(p.images || []);
    const compatYearsStr = typeof p.compatible_years === 'string' ? p.compatible_years : JSON.stringify(p.compatible_years || ['All']);
    const specsStr = typeof p.specifications === 'string' ? p.specifications : JSON.stringify(p.specifications || {});

    await conn.query(
      `INSERT INTO parts (
         id, name, brand, subbrand, sku, category, description, price, stock, location,
         image_url, images, video_url, compatible_years, badge, warranty_months, specifications, \`rank\`
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name), brand = VALUES(brand), subbrand = VALUES(subbrand),
         sku = VALUES(sku), category = VALUES(category), description = VALUES(description),
         price = VALUES(price), stock = VALUES(stock), location = VALUES(location),
         image_url = VALUES(image_url), images = VALUES(images), video_url = VALUES(video_url),
         compatible_years = VALUES(compatible_years), badge = VALUES(badge),
         warranty_months = VALUES(warranty_months), specifications = VALUES(specifications)`,
      [
        p.id, p.name, p.brand, p.subbrand, p.sku, p.category || 'Accessories',
        p.description || '', p.price || 0, p.stock || 1, p.location || 'Studio Shelf A',
        p.image_url || null, imagesStr, p.video_url || null, compatYearsStr,
        p.badge || null, p.warranty_months || 12, specsStr
      ]
    );
  }

  // 4. Migrate Banners
  const banners = sqlite.prepare('SELECT * FROM banners').all();
  console.log(`6. Migrating ${banners.length} Hero Banners...`);
  for (const bn of banners) {
    await conn.query(
      `INSERT INTO banners (id, title, subtitle, badge, image_url, cta_text, cta_link, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title), subtitle = VALUES(subtitle), badge = VALUES(badge),
         image_url = VALUES(image_url), cta_text = VALUES(cta_text), cta_link = VALUES(cta_link),
         is_active = VALUES(is_active), sort_order = VALUES(sort_order)`,
      [
        bn.id, bn.title, bn.subtitle || null, bn.badge || null, bn.image_url,
        bn.cta_text || 'Explore Accessories', bn.cta_link || '#catalog',
        Boolean(bn.is_active), bn.sort_order || 0
      ]
    );
  }

  // 5. Migrate Quotations
  const quotations = sqlite.prepare('SELECT * FROM quotations').all();
  console.log(`7. Migrating ${quotations.length} Quotations & Enquiries...`);
  for (const q of quotations) {
    const itemsStr = typeof q.items === 'string' ? q.items : JSON.stringify(q.items || []);
    await conn.query(
      `INSERT INTO quotations (
         id, customer_name, customer_phone, customer_email, vehicle_brand, vehicle_model, vehicle_year,
         items, subtotal, labor_total, discount_amount, tax_amount, grand_total, is_priced, notes, status, created_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         customer_name = VALUES(customer_name), customer_phone = VALUES(customer_phone),
         customer_email = VALUES(customer_email), vehicle_brand = VALUES(vehicle_brand),
         vehicle_model = VALUES(vehicle_model), vehicle_year = VALUES(vehicle_year),
         items = VALUES(items), subtotal = VALUES(subtotal), labor_total = VALUES(labor_total),
         discount_amount = VALUES(discount_amount), tax_amount = VALUES(tax_amount),
         grand_total = VALUES(grand_total), is_priced = VALUES(is_priced), notes = VALUES(notes),
         status = VALUES(status), created_at = VALUES(created_at)`,
      [
        q.id, q.customer_name, q.customer_phone, q.customer_email || null,
        q.vehicle_brand || null, q.vehicle_model || null, q.vehicle_year || null,
        itemsStr, q.subtotal || 0, q.labor_total || 0, q.discount_amount || 0,
        q.tax_amount || 0, q.grand_total || 0, Boolean(q.is_priced), q.notes || null,
        q.status || 'New Enquiry', q.created_at || new Date().toISOString()
      ]
    );
  }

  // 6. Migrate Warranties
  const warranties = sqlite.prepare('SELECT * FROM warranties').all();
  console.log(`8. Migrating ${warranties.length} Warranties...`);
  for (const w of warranties) {
    await conn.query(
      `INSERT INTO warranties (
         id, customer_name, customer_phone, customer_email, invoice_no, vehicle_reg_no,
         product_name, product_id, serial_number, purchase_date, expiry_date, warranty_months, studio_location, status
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         customer_name = VALUES(customer_name), customer_phone = VALUES(customer_phone),
         customer_email = VALUES(customer_email), invoice_no = VALUES(invoice_no),
         vehicle_reg_no = VALUES(vehicle_reg_no), product_name = VALUES(product_name),
         product_id = VALUES(product_id), serial_number = VALUES(serial_number),
         purchase_date = VALUES(purchase_date), expiry_date = VALUES(expiry_date),
         warranty_months = VALUES(warranty_months), studio_location = VALUES(studio_location),
         status = VALUES(status)`,
      [
        w.id, w.customer_name, w.customer_phone, w.customer_email || null,
        w.invoice_no, w.vehicle_reg_no, w.product_name, w.product_id,
        w.serial_number, w.purchase_date, w.expiry_date, w.warranty_months || 12,
        w.studio_location || 'Cars9 Flagship Studio, Indiranagar, Bangalore', w.status || 'Active'
      ]
    );
  }

  console.log("\n=================================================");
  console.log("  ✅ SUCCESS: ALL DATA MIGRATED TO HOSTINGER!     ");
  console.log("=================================================\n");

  await conn.end();
  sqlite.close();
}

migrate().catch(console.error);
