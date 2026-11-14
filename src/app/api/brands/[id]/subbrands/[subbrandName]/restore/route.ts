import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subbrands, brands } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; subbrandName: string }> }
) {
  try {
    const { id, subbrandName } = await params;
    const decodedName = decodeURIComponent(subbrandName);

    // Also ensure parent brand is active
    await db.update(brands)
      .set({ isDeleted: false, deletedAt: null })
      .where(eq(brands.id, id));

    // Restore model
    await db.update(subbrands)
      .set({ isDeleted: false, deletedAt: null })
      .where(
        and(
          eq(subbrands.brandId, id),
          eq(subbrands.name, decodedName)
        )
      );

    return NextResponse.json({ success: true, brandId: id, modelName: decodedName, restored: true });
  } catch (error: any) {
    console.error("Failed to restore subbrand:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
