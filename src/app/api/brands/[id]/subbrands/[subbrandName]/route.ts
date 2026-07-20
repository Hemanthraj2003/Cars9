import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subbrands } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; subbrandName: string }> }
) {
  try {
    const { id, subbrandName } = await params;
    const decodedName = decodeURIComponent(subbrandName);

    await db.delete(subbrands).where(
      and(
        eq(subbrands.brandId, id),
        eq(subbrands.name, decodedName)
      )
    );
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
