import { NextResponse } from 'next/server';
import { getTelegramImageUrl } from '@/lib/telegram';

export async function GET(request: Request, { params }: { params: Promise<{ file_id: string }> }) {
  try {
    const { file_id } = await params;
    if (!file_id || file_id === 'placeholder') {
      return NextResponse.redirect(new URL('/images/cars9-logo.png', request.url));
    }

    const downloadUrl = await getTelegramImageUrl(file_id);
    return NextResponse.redirect(downloadUrl);
  } catch (error: any) {
    console.warn(`Telegram image stream fallback for file_id:`, error.message);
    // Graceful fallback to logo so pages never show broken image icons
    return NextResponse.redirect(new URL('/images/cars9-logo.png', request.url));
  }
}
