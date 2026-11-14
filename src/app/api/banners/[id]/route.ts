import { NextResponse } from 'next/server';
import { db } from '@/db';
import { banners } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bannerId = parseInt(id, 10);
    if (isNaN(bannerId)) {
      return NextResponse.json({ error: 'Invalid banner ID' }, { status: 400 });
    }

    const body = await request.json();
    await db
      .update(banners)
      .set(body)
      .where(eq(banners.id, bannerId));

    const rows = await db.select().from(banners).where(eq(banners.id, bannerId));
    return NextResponse.json(rows[0] || { id: bannerId, ...body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bannerId = parseInt(id, 10);
    if (isNaN(bannerId)) {
      return NextResponse.json({ error: 'Invalid banner ID' }, { status: 400 });
    }

    await db.delete(banners).where(eq(banners.id, bannerId));
    return NextResponse.json({ success: true, message: `Banner ${bannerId} deleted` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
