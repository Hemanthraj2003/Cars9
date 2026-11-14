import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subbrands } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; subbrandName: string }> }
) {
  try {
    const { id, subbrandName } = await params;
    const decodedName = decodeURIComponent(subbrandName);
    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.years !== undefined) {
      updateData.years = typeof body.years === 'string' ? body.years : JSON.stringify(body.years);
    }
    if (body.isDeleted !== undefined) updateData.isDeleted = body.isDeleted;
    if (body.deletedAt !== undefined) updateData.deletedAt = body.deletedAt;

    await db.update(subbrands)
      .set(updateData)
      .where(
        and(
          eq(subbrands.brandId, id),
          eq(subbrands.name, decodedName)
        )
      );

    return NextResponse.json({ success: true, brandId: id, ...updateData });
  } catch (error: any) {
    console.error("Failed to update subbrand:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; subbrandName: string }> }
) {
  try {
    const { id, subbrandName } = await params;
    const { searchParams } = new URL(request.url);
    const isPermanent = searchParams.get('permanent') === 'true';
    const decodedName = decodeURIComponent(subbrandName);

    if (isPermanent) {
      await db.delete(subbrands).where(
        and(
          eq(subbrands.brandId, id),
          eq(subbrands.name, decodedName)
        )
      );
    } else {
      const now = new Date().toISOString();
      await db.update(subbrands)
        .set({ isDeleted: true, deletedAt: now })
        .where(
          and(
            eq(subbrands.brandId, id),
            eq(subbrands.name, decodedName)
          )
        );
    }
    
    return NextResponse.json({ success: true, permanent: isPermanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
