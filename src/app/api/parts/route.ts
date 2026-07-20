import { NextResponse } from 'next/server';
import { db } from '@/db';
import { parts } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allParts = await db.select().from(parts).orderBy(desc(parts.id));
    
    return NextResponse.json(allParts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real app, generate ID properly. Here we mock it.
    const newId = `9601K${Math.floor(Math.random() * 1000) + 100}`;
    
    const newPart = {
      id: newId,
      name: body.name,
      brand: body.brand,
      subbrand: body.subbrand,
      sku: body.sku,
      description: body.description,
      price: Number(body.price),
      stock: Number(body.stock),
      location: body.location,
      imageUrl: body.imageUrl || null,
      specifications: body.specifications || null
    };

    await db.insert(parts).values(newPart);

    return NextResponse.json({ ...newPart, specifications: body.specifications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
