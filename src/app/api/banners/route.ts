import { NextResponse } from 'next/server';
import { db } from '@/db';
import { banners } from '@/db/schema';
import { desc, asc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    const results = await db.select().from(banners).orderBy(asc(banners.sortOrder));
    
    // If not admin requesting all, only return active banners
    const filtered = all ? results : results.filter((b: any) => b.isActive);
    return NextResponse.json(filtered);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, badge, imageUrl, ctaText, ctaLink, isActive, sortOrder } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and Image URL are required' }, { status: 400 });
    }

    const insertData = {
      title,
      subtitle: subtitle || '',
      badge: badge || null,
      imageUrl,
      ctaText: ctaText || 'Explore Accessories',
      ctaLink: ctaLink || '#catalog',
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
    };

    const res = await db.insert(banners).values(insertData);
    let newId = res[0]?.insertId || res.lastInsertRowid;
    if (!newId) {
      const all = await db.select().from(banners).orderBy(desc(banners.id));
      newId = all[0]?.id || Date.now();
    }

    return NextResponse.json({ id: newId, ...insertData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
