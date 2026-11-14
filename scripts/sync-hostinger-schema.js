require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function syncSchema() {
  console.log("Connecting to Hostinger MySQL...");
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("Creating/updating tables on Hostinger MySQL...");

  // 1. brands
  await conn.query(`
    CREATE TABLE IF NOT EXISTS brands (
      id VARCHAR(191) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      logo_url TEXT,
      \`rank\` INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 2. subbrands
  await conn.query(`
    CREATE TABLE IF NOT EXISTS subbrands (
      id INT AUTO_INCREMENT PRIMARY KEY,
      brand_id VARCHAR(191) NOT NULL,
      name VARCHAR(255) NOT NULL,
      image_url TEXT,
      years TEXT,
      \`rank\` INT DEFAULT 0,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Ensure 'years' column exists on subbrands
  try {
    await conn.query(`ALTER TABLE subbrands ADD COLUMN years TEXT;`);
    console.log("Added column 'years' to subbrands.");
  } catch (e) {
    // Already exists
  }

  // 3. parts
  await conn.query(`
    CREATE TABLE IF NOT EXISTS parts (
      id VARCHAR(191) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(191) NOT NULL,
      subbrand VARCHAR(191) NOT NULL,
      sku VARCHAR(191) NOT NULL,
      category VARCHAR(100) DEFAULT 'Accessories',
      description TEXT NOT NULL,
      price DOUBLE NOT NULL,
      stock INT NOT NULL,
      location VARCHAR(255) NOT NULL,
      image_url TEXT,
      images TEXT,
      video_url TEXT,
      compatible_years TEXT,
      badge VARCHAR(100),
      warranty_months INT DEFAULT 12,
      specifications LONGTEXT,
      \`rank\` INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Add any missing columns to parts
  const partColsToAdd = [
    { name: 'images', type: 'TEXT' },
    { name: 'video_url', type: 'TEXT' },
    { name: 'compatible_years', type: 'TEXT' },
    { name: 'badge', type: 'VARCHAR(100)' },
    { name: 'warranty_months', type: 'INT DEFAULT 12' },
  ];

  for (const col of partColsToAdd) {
    try {
      await conn.query(`ALTER TABLE parts ADD COLUMN ${col.name} ${col.type};`);
      console.log(`Added column '${col.name}' to parts.`);
    } catch (e) {
      // Already exists
    }
  }

  // 4. banners
  await conn.query(`
    CREATE TABLE IF NOT EXISTS banners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subtitle TEXT,
      badge VARCHAR(100),
      image_url TEXT NOT NULL,
      cta_text VARCHAR(100) DEFAULT 'Explore Accessories',
      cta_link VARCHAR(255) DEFAULT '#catalog',
      is_active BOOLEAN DEFAULT TRUE,
      sort_order INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log("Table 'banners' ready.");

  // 5. quotations
  await conn.query(`
    CREATE TABLE IF NOT EXISTS quotations (
      id VARCHAR(191) PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50) NOT NULL,
      customer_email VARCHAR(255),
      vehicle_brand VARCHAR(100),
      vehicle_model VARCHAR(100),
      vehicle_year VARCHAR(50),
      items LONGTEXT NOT NULL,
      subtotal DOUBLE DEFAULT 0,
      labor_total DOUBLE DEFAULT 0,
      discount_amount DOUBLE DEFAULT 0,
      tax_amount DOUBLE DEFAULT 0,
      grand_total DOUBLE DEFAULT 0,
      is_priced BOOLEAN DEFAULT FALSE,
      notes TEXT,
      status VARCHAR(100) DEFAULT 'New Enquiry',
      created_at VARCHAR(100) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log("Table 'quotations' ready.");

  // 6. warranties
  await conn.query(`
    CREATE TABLE IF NOT EXISTS warranties (
      id VARCHAR(191) PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50) NOT NULL,
      customer_email VARCHAR(255),
      invoice_no VARCHAR(100) NOT NULL,
      vehicle_reg_no VARCHAR(100) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      product_id VARCHAR(100) NOT NULL,
      serial_number VARCHAR(100) NOT NULL,
      purchase_date VARCHAR(50) NOT NULL,
      expiry_date VARCHAR(50) NOT NULL,
      warranty_months INT DEFAULT 12,
      studio_location VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'Active'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log("Table 'warranties' ready.");

  // 7. site_settings
  await conn.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      \`key\` VARCHAR(191) PRIMARY KEY,
      \`value\` LONGTEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log("Table 'site_settings' ready.");

  console.log("\n✅ All Hostinger MySQL tables synced and ready!");
  await conn.end();
}

syncSchema().catch(console.error);
