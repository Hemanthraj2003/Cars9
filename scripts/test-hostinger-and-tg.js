require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testTelegram() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  console.log("1. Testing Telegram Bot Token...");
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    if (data.ok) {
      console.log(`✅ Telegram Bot Connected: ${data.result.first_name} (@${data.result.username})`);
    } else {
      console.log(`❌ Telegram Bot Error: ${data.description}`);
    }
  } catch (e) {
    console.error(`❌ Telegram Connection Error: ${e.message}`);
  }
}

async function testHostingerMySQL() {
  console.log("\n2. Testing Hostinger MySQL Database...");
  console.log(`Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT} as ${process.env.DB_USER}...`);
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000,
    });
    console.log("✅ Hostinger MySQL Connected Successfully!");

    const [tables] = await conn.query("SHOW TABLES");
    console.log("Existing tables in Hostinger Database:", tables);

    await conn.end();
  } catch (e) {
    console.error(`❌ Hostinger MySQL Connection Error: ${e.message}`);
  }
}

async function run() {
  await testTelegram();
  await testHostingerMySQL();
}

run();
