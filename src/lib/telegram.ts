import Database from 'better-sqlite3';
import path from 'path';

// In-memory cache for resolved Telegram file URLs (valid for 1 hour)
const urlCache = new Map<string, { url: string; expiresAt: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Retrieves Telegram credentials from environment variables or SQLite site_settings table
 */
export function getTelegramCredentials(): { botToken: string; chatId: string } {
  let botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || '';
  let chatId = process.env.TELEGRAM_CHAT_ID?.trim() || '';

  // If not in env, check SQLite site_settings
  if (!botToken || !chatId) {
    try {
      const dbPath = path.join(process.cwd(), 'sqlite.db');
      const db = new Database(dbPath);
      const rows = db.prepare("SELECT key, value FROM site_settings WHERE key IN ('telegram_bot_token', 'telegram_chat_id')").all() as Array<{ key: string; value: string }>;
      
      for (const row of rows) {
        let val = row.value;
        try {
          val = JSON.parse(row.value);
        } catch {}

        if (row.key === 'telegram_bot_token' && !botToken) {
          botToken = String(val).trim();
        }
        if (row.key === 'telegram_chat_id' && !chatId) {
          chatId = String(val).trim();
        }
      }
    } catch (e) {
      // Database might not be initialized yet
    }
  }

  return { botToken, chatId };
}

export function isTelegramConfigured(): boolean {
  const { botToken, chatId } = getTelegramCredentials();
  return Boolean(botToken && chatId);
}

/**
 * Test the Telegram Bot token by calling getMe
 */
export async function testTelegramConnection(): Promise<{ ok: boolean; botName?: string; username?: string; error?: string }> {
  const { botToken } = getTelegramCredentials();
  if (!botToken) {
    return { ok: false, error: 'Telegram Bot Token is not configured' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = await res.json();
    if (data.ok && data.result) {
      return {
        ok: true,
        botName: data.result.first_name,
        username: data.result.username,
      };
    }
    return { ok: false, error: data.description || 'Failed to connect to Telegram' };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Network error connecting to Telegram' };
  }
}

/**
 * Upload an image buffer to Telegram channel/chat and return its file_id
 */
export async function uploadImageToTelegram(imageBuffer: Buffer, filename: string): Promise<string> {
  const { botToken, chatId } = getTelegramCredentials();

  if (!botToken || !chatId) {
    throw new Error('Telegram credentials (Bot Token or Chat ID) not configured');
  }

  const formData = new FormData();
  formData.append('chat_id', chatId);

  // Guess mime-type from filename
  const lower = filename.toLowerCase();
  const mimeType = lower.endsWith('.png')
    ? 'image/png'
    : lower.endsWith('.webp')
    ? 'image/webp'
    : lower.endsWith('.svg')
    ? 'image/svg+xml'
    : 'image/jpeg';

  const blob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });
  formData.append('photo', blob, filename);

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Telegram API Error: ${data.description}`);
  }

  // Get the file_id of the highest resolution photo (last item in photo array)
  const photoArray = data.result.photo;
  if (!photoArray || photoArray.length === 0) {
    throw new Error('Telegram did not return photo data');
  }

  const fileId = photoArray[photoArray.length - 1].file_id;
  return fileId;
}

/**
 * Resolve a Telegram file_id to its direct download CDN URL with caching
 */
export async function getTelegramImageUrl(fileId: string): Promise<string> {
  const cached = urlCache.get(fileId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  const { botToken } = getTelegramCredentials();
  if (!botToken) {
    throw new Error('Telegram credentials not configured');
  }

  // 1. Get file path from Telegram
  const response = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Telegram API Error: ${data.description}`);
  }

  const filePath = data.result?.file_path;
  if (!filePath) {
    throw new Error('Telegram did not return a valid file path');
  }

  // 2. Construct download URL
  const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

  // Cache URL for 1 hour
  urlCache.set(fileId, {
    url: downloadUrl,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return downloadUrl;
}
