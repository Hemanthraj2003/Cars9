import { NextResponse } from 'next/server';
import { db } from '@/db';
import { quotations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.select().from(quotations).where(eq(quotations.id, id));
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    const q = existing[0];
    return NextResponse.json({
      ...q,
      items: typeof q.items === 'string' ? JSON.parse(q.items) : q.items
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const payload: any = { ...body };
    if (payload.items && typeof payload.items !== 'string') {
      payload.items = JSON.stringify(payload.items);
    }

    await db.update(quotations).set(payload).where(eq(quotations.id, id));

    const updated = await db.select().from(quotations).where(eq(quotations.id, id));
    if (updated.length === 0) {
      return NextResponse.json({ error: 'Quotation not found after update' }, { status: 404 });
    }

    const q = updated[0];
    return NextResponse.json({
      ...q,
      items: typeof q.items === 'string' ? JSON.parse(q.items) : q.items
    });
  } catch (error: any) {
    console.error('Error updating quotation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(quotations).where(eq(quotations.id, id));
    return NextResponse.json({ success: true, message: `Quotation ${id} deleted` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
