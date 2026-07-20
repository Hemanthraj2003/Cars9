import { NextResponse } from 'next/server';
import { getTelegramImageUrl } from '@/lib/telegram';

export async function GET(request: Request, { params }: { params: Promise<{ file_id: string }> }) {
  try {
    const { file_id } = await params;
    const downloadUrl = await getTelegramImageUrl(file_id);
    
    return NextResponse.redirect(downloadUrl);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
