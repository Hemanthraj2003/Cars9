export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function uploadImageToTelegram(imageBuffer: Buffer, filename: string): Promise<string> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('Telegram credentials not configured');
  }

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

  // Get the file_id of the highest resolution photo (last in the array)
  const photoArray = data.result.photo;
  const fileId = photoArray[photoArray.length - 1].file_id;
  
  return fileId;
}

export async function getTelegramImageUrl(fileId: string): Promise<string> {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('Telegram credentials not configured');
  }

  // 1. Get file path
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
  const data = await response.json();
  
  if (!data.ok) {
    throw new Error(`Telegram API Error: ${data.description}`);
  }

  const filePath = data.result.file_path;
  
  // 2. Construct download URL
  return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
}
