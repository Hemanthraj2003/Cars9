import { NextResponse } from 'next/server';
import { db } from '@/db';
import { warranties } from '@/db/schema';
import { desc, or, like } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim().toLowerCase();

    const allWarranties = await db.select().from(warranties).orderBy(desc(warranties.purchaseDate));

    if (!q) {
      return NextResponse.json(allWarranties);
    }

    const filtered = allWarranties.filter((w: any) => 
      w.id.toLowerCase().includes(q) ||
      w.customerPhone.includes(q) ||
      w.vehicleRegNo.toLowerCase().includes(q) ||
      w.serialNumber.toLowerCase().includes(q) ||
      w.invoiceNo.toLowerCase().includes(q) ||
      w.customerName.toLowerCase().includes(q)
    );

    return NextResponse.json(filtered);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, invoiceNo, vehicleRegNo, productName, productId, serialNumber, purchaseDate, warrantyMonths, studioLocation } = body;

    if (!customerName || !customerPhone || !invoiceNo || !serialNumber) {
      return NextResponse.json({ error: 'Customer Name, Phone, Invoice No and Serial No are required' }, { status: 400 });
    }

    const newId = `C9-WRN-${Math.floor(1000 + Math.random() * 9000)}`;
    const pDate = purchaseDate || new Date().toISOString().split('T')[0];
    const months = Number(warrantyMonths) || 12;

    const d = new Date(pDate);
    d.setMonth(d.getMonth() + months);
    const expiryDate = d.toISOString().split('T')[0];

    const newRecord = {
      id: newId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      invoiceNo,
      vehicleRegNo: vehicleRegNo || 'KA-XX-XXXX',
      productName: productName || 'Cars9 Signature Accessory',
      productId: productId || 'C9-ACC',
      serialNumber,
      purchaseDate: pDate,
      expiryDate,
      warrantyMonths: months,
      studioLocation: studioLocation || 'Cars9 Flagship Studio, Indiranagar, Bangalore',
      status: 'Active'
    };

    await db.insert(warranties).values(newRecord);

    return NextResponse.json(newRecord);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
