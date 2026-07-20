const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
require('dotenv').config({ path: '.env.local' });

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error("Missing Telegram credentials in .env.local");
  process.exit(1);
}

const db = new Database('sqlite.db');

async function uploadImageToTelegram(imageBuffer, filename) {
  const formData = new FormData();
  formData.append('chat_id', TELEGRAM_CHAT_ID);
  
  const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'image/jpeg' });
  formData.append('photo', blob, filename);

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (!data.ok) {
    throw new Error(`Telegram API Error: ${data.description}`);
  }

  const photoArray = data.result.photo;
  return photoArray[photoArray.length - 1].file_id;
}

async function run() {
  const parts = db.prepare('SELECT id, image_url FROM parts WHERE image_url IS NOT NULL').all();
  
  for (const part of parts) {
    // If the imageUrl starts with /images/, it's a local file
    if (part.image_url.startsWith('/images/')) {
      const filename = path.basename(part.image_url);
      const filePath = path.join(process.cwd(), 'public', 'images', filename);
      
      if (fs.existsSync(filePath)) {
        console.log(`Uploading ${filename} for part ${part.id}...`);
        const buffer = fs.readFileSync(filePath);
        
        try {
          const fileId = await uploadImageToTelegram(buffer, filename);
          const newUrl = `/api/images/${fileId}`;
          
          db.prepare('UPDATE parts SET image_url = ? WHERE id = ?').run(newUrl, part.id);
          console.log(`Successfully updated part ${part.id} with new TG image url.`);
        } catch (e) {
          console.error(`Failed to upload ${filename}:`, e.message);
        }
      } else {
        console.log(`File ${filePath} not found, skipping...`);
      }
    }
  }
  
  console.log("Migration complete!");
}

run();
