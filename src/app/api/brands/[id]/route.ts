import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brands, subbrands } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.logo !== undefined) updateData.logo = body.logo;
    if (body.isDeleted !== undefined) updateData.isDeleted = body.isDeleted;
    if (body.deletedAt !== undefined) updateData.deletedAt = body.deletedAt;

    await db.update(brands).set(updateData).where(eq(brands.id, id));

    return NextResponse.json({ success: true, id, ...updateData });
  } catch (error: any) {
    console.error("Failed to update brand:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const isPermanent = searchParams.get('permanent') === 'true';

    if (isPermanent) {
      // Subbrands are set to ON DELETE CASCADE in the schema, 
      // so deleting the brand will also permanently delete its subbrands.
      await db.delete(brands).where(eq(brands.id, id));
    } else {
      // Soft-delete brand and its subbrands
      const now = new Date().toISOString();
      await db.update(brands)
        .set({ isDeleted: true, deletedAt: now })
        .where(eq(brands.id, id));

      await db.update(subbrands)
        .set({ isDeleted: true, deletedAt: now })
        .where(eq(subbrands.brandId, id));
    }
    
    return NextResponse.json({ success: true, permanent: isPermanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
