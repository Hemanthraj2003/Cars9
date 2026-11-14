import { NextResponse } from 'next/server';
import { db } from '@/db';
import { quotations } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allQuotes = await db.select().from(quotations).orderBy(desc(quotations.createdAt));
    const formatted = allQuotes.map((q: any) => ({
      ...q,
      items: typeof q.items === 'string' ? JSON.parse(q.items) : q.items
    }));
    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, vehicleBrand, vehicleModel, vehicleYear, items, notes } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Name, phone and at least one item are required' }, { status: 400 });
    }

    const newId = `C9-Q-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newQuote = {
      id: newId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      vehicleBrand: vehicleBrand || 'General',
      vehicleModel: vehicleModel || 'All Models',
      vehicleYear: vehicleYear || '',
      items: JSON.stringify(items),
      notes: notes || '',
      status: 'New Enquiry',
      createdAt: new Date().toISOString(),
    };

    await db.insert(quotations).values(newQuote);

    return NextResponse.json({
      ...newQuote,
      items
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
