import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brands, subbrands } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Subbrands are set to ON DELETE CASCADE in the schema, 
    // so deleting the brand will also delete its subbrands.
    await db.delete(brands).where(eq(brands.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
