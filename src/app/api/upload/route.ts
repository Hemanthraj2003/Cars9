import { NextResponse } from 'next/server';
import { uploadImageToTelegram } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Give it a generic name if not provided
    const filename = (file as any).name || 'upload.jpg';

    const file_id = await uploadImageToTelegram(buffer, filename);
    
    return NextResponse.json({ file_id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
