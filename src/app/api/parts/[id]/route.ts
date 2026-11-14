import { NextResponse } from 'next/server';
import { db } from '@/db';
import { parts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await db.select().from(parts).where(eq(parts.id, id));
    if (existing.length === 0) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }

    const p = existing[0];
    const formatted = {
      ...p,
      images: p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : (p.imageUrl ? [p.imageUrl] : []),
      compatibleYears: p.compatibleYears ? (typeof p.compatibleYears === 'string' ? JSON.parse(p.compatibleYears) : p.compatibleYears) : ['All'],
      specifications: p.specifications ? (typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications) : {},
    };

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleUpdate(request, params);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleUpdate(request, params);
}

async function handleUpdate(request: Request, params: Promise<{ id: string }>) {
  try {
    const body = await request.json();
    const { id } = await params;
    
    const existing = await db.select().from(parts).where(eq(parts.id, id));
    if (existing.length === 0) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.subbrand !== undefined) updateData.subbrand = body.subbrand;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.sku !== undefined) updateData.sku = body.sku;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.location !== undefined) updateData.location = body.location;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl;
    if (body.badge !== undefined) updateData.badge = body.badge;
    if (body.warrantyMonths !== undefined) updateData.warrantyMonths = Number(body.warrantyMonths);
    
    if (body.images !== undefined) {
      updateData.images = JSON.stringify(body.images);
      if (!updateData.imageUrl && body.images.length > 0) {
        updateData.imageUrl = body.images[0];
      }
    }

    if (body.compatibleYears !== undefined) {
      updateData.compatibleYears = JSON.stringify(body.compatibleYears);
    }

    if (body.specifications !== undefined) {
      updateData.specifications = JSON.stringify(body.specifications);
    }

    if (body.isDeleted !== undefined) {
      updateData.isDeleted = Boolean(body.isDeleted);
    }

    if (body.deletedAt !== undefined) {
      updateData.deletedAt = body.deletedAt;
    }

    await db.update(parts).set(updateData).where(eq(parts.id, id));

    return NextResponse.json({ success: true, updated: updateData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    const existing = await db.select().from(parts).where(eq(parts.id, id));
    if (existing.length === 0) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }

    if (permanent) {
      await db.delete(parts).where(eq(parts.id, id));
      return NextResponse.json({ success: true, permanent: true, message: `Accessory ${id} permanently deleted` });
    } else {
      // Soft-delete to Recycle Bin
      await db.update(parts).set({
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      }).where(eq(parts.id, id));

      return NextResponse.json({
        success: true,
        permanent: false,
        message: `Accessory ${id} moved to Recycle Bin`,
        item: existing[0],
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
