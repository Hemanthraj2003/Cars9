import { NextResponse } from 'next/server';
import { db } from '@/db';
import { parts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.select().from(parts).where(eq(parts.id, id));
    if (existing.length === 0) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }

    await db.update(parts).set({
      isDeleted: false,
      deletedAt: null,
    }).where(eq(parts.id, id));

    return NextResponse.json({
      success: true,
      message: `Accessory ${id} restored to catalog`,
      id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
