import { NextResponse } from 'next/server';
import { uploadImageToTelegram, isTelegramConfigured } from '@/lib/telegram';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = (file as any).name || 'upload.jpg';
    const cleanExt = path.extname(originalName) || '.jpg';

    // If Telegram credentials are configured (via .env or admin panel settings)
    if (isTelegramConfigured()) {
      try {
        const file_id = await uploadImageToTelegram(buffer, originalName);
        return NextResponse.json({ 
          file_id, 
          url: `/api/images/${file_id}`,
          source: 'telegram'
        });
      } catch (tgErr: any) {
        console.warn('Telegram CDN upload failed, falling back to local file storage:', tgErr.message);
      }
    }

    // Fallback: save to public/uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const uniqueName = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}${cleanExt}`;
    const filePath = path.join(uploadsDir, uniqueName);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      url: `/uploads/${uniqueName}`,
      source: 'local',
      notice: 'Saved to local storage. Configure Telegram Bot Token & Chat ID in Admin Panel to use free global CDN.'
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
