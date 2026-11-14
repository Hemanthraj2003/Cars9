const path = require('path');
const Database = require('better-sqlite3');
const pgPkg = require('postgres');
const postgres = typeof pgPkg === 'function' ? pgPkg : pgPkg.default;
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.error("❌ Error: No DATABASE_URL or POSTGRES_URL found in .env.local or environment.");
  console.error("Please add your PostgreSQL connection string in .env.local:");
  console.error("DATABASE_URL=\"postgresql://username:password@host:port/database?sslmode=require\"\n");
  process.exit(1);
}

async function migrate() {
  console.log("=================================================");
  console.log("  CARS9 STUDIO: SQLITE -> POSTGRESQL MIGRATION   ");
  console.log("=================================================\n");

  const sqlitePath = path.join(process.cwd(), 'sqlite.db');
  console.log(`1. Reading source SQLite database: ${sqlitePath}`);
  const sqlite = new Database(sqlitePath);

  console.log(`2. Connecting to target PostgreSQL instance...`);
  const pg = postgres(databaseUrl, {
    max: 5,
    ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1') ? false : 'require',
  });

  try {
    // 1. Create tables in PostgreSQL
    console.log("3. Ensuring PostgreSQL schema tables exist...");
    await pg`
      CREATE TABLE IF NOT EXISTS brands (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        logo TEXT
      );
    `;
    await pg`
      CREATE TABLE IF NOT EXISTS subbrands (
        id SERIAL PRIMARY KEY,
        brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        years TEXT
      );
    `;
    await pg`
      CREATE TABLE IF NOT EXISTS parts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        subbrand TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'Accessories',
        sku TEXT NOT NULL,
        description TEXT NOT NULL,
        price DOUBLE PRECISION NOT NULL,
        stock INTEGER NOT NULL,
        location TEXT NOT NULL,
        image_url TEXT,
        images TEXT,
        video_url TEXT,
        compatible_years TEXT,
        badge TEXT,
        warranty_months INTEGER DEFAULT 12,
        specifications TEXT
      );
    `;
    await pg`
      CREATE TABLE IF NOT EXISTS banners (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        badge TEXT,
        image_url TEXT NOT NULL,
        cta_text TEXT DEFAULT 'Explore Accessories',
        cta_link TEXT DEFAULT '#catalog',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        sort_order INTEGER NOT NULL DEFAULT 0
      );
    `;
    await pg`
      CREATE TABLE IF NOT EXISTS quotations (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        vehicle_brand TEXT,
        vehicle_model TEXT,
        vehicle_year TEXT,
        items TEXT NOT NULL,
        subtotal DOUBLE PRECISION DEFAULT 0,
        labor_total DOUBLE PRECISION DEFAULT 0,
        discount_amount DOUBLE PRECISION DEFAULT 0,
        tax_amount DOUBLE PRECISION DEFAULT 0,
        grand_total DOUBLE PRECISION DEFAULT 0,
        is_priced BOOLEAN DEFAULT FALSE,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'New Enquiry',
        created_at TEXT NOT NULL
      );
    `;
    await pg`
      CREATE TABLE IF NOT EXISTS warranties (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        invoice_no TEXT NOT NULL,
        vehicle_reg_no TEXT NOT NULL,
        product_name TEXT NOT NULL,
        product_id TEXT NOT NULL,
        serial_number TEXT NOT NULL,
        purchase_date TEXT NOT NULL,
        expiry_date TEXT NOT NULL,
        warranty_months INTEGER NOT NULL DEFAULT 12,
        studio_location TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active'
      );
    `;
    await pg`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `;

    // 2. Migrate Brands
    const brands = sqlite.prepare('SELECT * FROM brands').all();
    console.log(`4. Migrating ${brands.length} Brands...`);
    for (const b of brands) {
      await pg`
        INSERT INTO brands (id, name, logo)
        VALUES (${b.id}, ${b.name}, ${b.logo || null})
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, logo = EXCLUDED.logo
      `;
    }

    // 3. Migrate Subbrands
    const subbrands = sqlite.prepare('SELECT * FROM subbrands').all();
    console.log(`5. Migrating ${subbrands.length} Subbrands / Vehicle Models...`);
    for (const sb of subbrands) {
      await pg`
        INSERT INTO subbrands (id, brand_id, name, years)
        VALUES (${sb.id}, ${sb.brand_id}, ${sb.name}, ${typeof sb.years === 'string' ? sb.years : JSON.stringify(sb.years || [])})
        ON CONFLICT (id) DO UPDATE SET brand_id = EXCLUDED.brand_id, name = EXCLUDED.name, years = EXCLUDED.years
      `;
    }

    // 4. Migrate Parts
    const parts = sqlite.prepare('SELECT * FROM parts').all();
    console.log(`6. Migrating ${parts.length} Products & Accessories...`);
    for (const p of parts) {
      await pg`
        INSERT INTO parts (
          id, name, brand, subbrand, category, sku, description, price, stock, location,
          image_url, images, video_url, compatible_years, badge, warranty_months, specifications
        ) VALUES (
          ${p.id}, ${p.name}, ${p.brand}, ${p.subbrand}, ${p.category || 'Accessories'}, ${p.sku},
          ${p.description || ''}, ${p.price || 0}, ${p.stock || 1}, ${p.location || 'Studio Shelf A'},
          ${p.image_url || null}, ${typeof p.images === 'string' ? p.images : JSON.stringify(p.images || [])},
          ${p.videoUrl || null}, ${typeof p.compatible_years === 'string' ? p.compatible_years : JSON.stringify(p.compatible_years || ['All'])},
          ${p.badge || null}, ${p.warranty_months || 12}, ${typeof p.specifications === 'string' ? p.specifications : JSON.stringify(p.specifications || {})}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name, brand = EXCLUDED.brand, subbrand = EXCLUDED.subbrand, category = EXCLUDED.category,
          sku = EXCLUDED.sku, description = EXCLUDED.description, price = EXCLUDED.price, stock = EXCLUDED.stock,
          location = EXCLUDED.location, image_url = EXCLUDED.image_url, images = EXCLUDED.images,
          video_url = EXCLUDED.video_url, compatible_years = EXCLUDED.compatible_years, badge = EXCLUDED.badge,
          warranty_months = EXCLUDED.warranty_months, specifications = EXCLUDED.specifications
      `;
    }

    // 5. Migrate Banners
    const banners = sqlite.prepare('SELECT * FROM banners').all();
    console.log(`7. Migrating ${banners.length} Hero Banners...`);
    for (const bn of banners) {
      await pg`
        INSERT INTO banners (id, title, subtitle, badge, image_url, cta_text, cta_link, is_active, sort_order)
        VALUES (
          ${bn.id}, ${bn.title}, ${bn.subtitle || null}, ${bn.badge || null}, ${bn.image_url},
          ${bn.cta_text || 'Explore Accessories'}, ${bn.cta_link || '#catalog'},
          ${Boolean(bn.is_active)}, ${bn.sort_order || 0}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, badge = EXCLUDED.badge,
          image_url = EXCLUDED.image_url, cta_text = EXCLUDED.cta_text, cta_link = EXCLUDED.cta_link,
          is_active = EXCLUDED.is_active, sort_order = EXCLUDED.sort_order
      `;
    }

    // 6. Migrate Quotations
    const quotations = sqlite.prepare('SELECT * FROM quotations').all();
    console.log(`8. Migrating ${quotations.length} Customer Quotations & Enquiries...`);
    for (const q of quotations) {
      await pg`
        INSERT INTO quotations (
          id, customer_name, customer_phone, customer_email, vehicle_brand, vehicle_model, vehicle_year,
          items, subtotal, labor_total, discount_amount, tax_amount, grand_total, is_priced, notes, status, created_at
        ) VALUES (
          ${q.id}, ${q.customer_name}, ${q.customer_phone}, ${q.customer_email || null},
          ${q.vehicle_brand || null}, ${q.vehicle_model || null}, ${q.vehicle_year || null},
          ${typeof q.items === 'string' ? q.items : JSON.stringify(q.items || [])},
          ${q.subtotal || 0}, ${q.labor_total || 0}, ${q.discount_amount || 0}, ${q.tax_amount || 0},
          ${q.grand_total || 0}, ${Boolean(q.is_priced)}, ${q.notes || null}, ${q.status || 'New Enquiry'},
          ${q.created_at || new Date().toISOString()}
        )
        ON CONFLICT (id) DO UPDATE SET
          customer_name = EXCLUDED.customer_name, customer_phone = EXCLUDED.customer_phone,
          customer_email = EXCLUDED.customer_email, vehicle_brand = EXCLUDED.vehicle_brand,
          vehicle_model = EXCLUDED.vehicle_model, vehicle_year = EXCLUDED.vehicle_year,
          items = EXCLUDED.items, subtotal = EXCLUDED.subtotal, labor_total = EXCLUDED.labor_total,
          discount_amount = EXCLUDED.discount_amount, tax_amount = EXCLUDED.tax_amount,
          grand_total = EXCLUDED.grand_total, is_priced = EXCLUDED.is_priced, notes = EXCLUDED.notes,
          status = EXCLUDED.status, created_at = EXCLUDED.created_at
      `;
    }

    // 7. Migrate Warranties
    const warranties = sqlite.prepare('SELECT * FROM warranties').all();
    console.log(`9. Migrating ${warranties.length} Warranties...`);
    for (const w of warranties) {
      await pg`
        INSERT INTO warranties (
          id, customer_name, customer_phone, customer_email, invoice_no, vehicle_reg_no,
          product_name, product_id, serial_number, purchase_date, expiry_date, warranty_months, studio_location, status
        ) VALUES (
          ${w.id}, ${w.customer_name}, ${w.customer_phone}, ${w.customer_email || null},
          ${w.invoice_no}, ${w.vehicle_reg_no}, ${w.product_name}, ${w.product_id},
          ${w.serial_number}, ${w.purchase_date}, ${w.expiry_date}, ${w.warranty_months || 12},
          ${w.studio_location || 'Cars9 Flagship Studio, Indiranagar, Bangalore'}, ${w.status || 'Active'}
        )
        ON CONFLICT (id) DO UPDATE SET
          customer_name = EXCLUDED.customer_name, customer_phone = EXCLUDED.customer_phone,
          customer_email = EXCLUDED.customer_email, invoice_no = EXCLUDED.invoice_no,
          vehicle_reg_no = EXCLUDED.vehicle_reg_no, product_name = EXCLUDED.product_name,
          product_id = EXCLUDED.product_id, serial_number = EXCLUDED.serial_number,
          purchase_date = EXCLUDED.purchase_date, expiry_date = EXCLUDED.expiry_date,
          warranty_months = EXCLUDED.warranty_months, studio_location = EXCLUDED.studio_location,
          status = EXCLUDED.status
      `;
    }

    // 8. Migrate Site Settings
    const settings = sqlite.prepare('SELECT * FROM site_settings').all();
    console.log(`10. Migrating ${settings.length} Site Settings & Passwords...`);
    for (const s of settings) {
      await pg`
        INSERT INTO site_settings (key, value)
        VALUES (${s.key}, ${s.value})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `;
    }

    console.log("\n=================================================");
    console.log("  ✅ SUCCESS: ALL DATA MIGRATED TO POSTGRESQL!    ");
    console.log("=================================================\n");
  } catch (err) {
    console.error("❌ Migration failed with error:", err);
  } finally {
    await pg.end();
    sqlite.close();
  }
}

migrate();
