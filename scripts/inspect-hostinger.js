require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function inspectTables() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  for (const table of ['brands', 'subbrands', 'parts', 'users']) {
    console.log(`\n=== Table: ${table} ===`);
    const [cols] = await conn.query(`DESCRIBE ${table}`);
    console.log(cols.map(c => `${c.Field} (${c.Type})`));
    const [count] = await conn.query(`SELECT COUNT(*) as count FROM ${table}`);
    console.log(`Total rows:`, count[0].count);
    if (count[0].count > 0) {
      const [sample] = await conn.query(`SELECT * FROM ${table} LIMIT 2`);
      console.log('Sample row:', sample[0]);
    }
  }

  await conn.end();
}

inspectTables();
