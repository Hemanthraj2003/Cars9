import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brands, subbrands } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Restore brand
    await db.update(brands)
      .set({ isDeleted: false, deletedAt: null })
      .where(eq(brands.id, id));

    // Restore subbrands under this brand
    await db.update(subbrands)
      .set({ isDeleted: false, deletedAt: null })
      .where(eq(subbrands.brandId, id));

    return NextResponse.json({ success: true, id, restored: true });
  } catch (error: any) {
    console.error("Failed to restore brand:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
