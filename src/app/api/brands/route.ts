import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brands, subbrands } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allBrands = await db.select().from(brands);
    const allSubbrands = await db.select().from(subbrands);

    // Reconstruct the nested structure
    const formattedBrands = allBrands.map(b => ({
      ...b,
      subbrands: allSubbrands.filter(sb => sb.brandId === b.id).map(sb => sb.name)
    }));

    return NextResponse.json(formattedBrands);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type, brandId } = body;

    if (type === 'brand') {
      const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      await db.insert(brands).values({ id, name });
      return NextResponse.json({ id, name, subbrands: [] });
    } else if (type === 'subbrand') {
      if (!brandId) throw new Error("brandId is required for subbrand");
      await db.insert(subbrands).values({ brandId, name });
      return NextResponse.json({ brandId, name });
    }
    
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
