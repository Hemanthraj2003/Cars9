import { NextResponse } from 'next/server';
import { db } from '@/db';
import { parts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { id } = await params;
    
    // Check if part exists
    const existing = await db.select().from(parts).where(eq(parts.id, id));
    if (existing.length === 0) {
      return NextResponse.json({ error: "Part not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.subbrand !== undefined) updateData.subbrand = body.subbrand;
    if (body.sku !== undefined) updateData.sku = body.sku;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.location !== undefined) updateData.location = body.location;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    
    if (body.specifications !== undefined) {
      // Merge with existing specifications
      const existingSpecs = (existing[0].specifications as any) || {};
      updateData.specifications = { ...existingSpecs, ...body.specifications };
    }

    await db.update(parts).set(updateData).where(eq(parts.id, id));

    return NextResponse.json({ success: true, updatedFields: body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(parts).where(eq(parts.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
