import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brands, subbrands, parts } from '@/db/schema';
import { initialBrands, initialParts } from '@/data/mockData';

export async function GET() {
  try {
    // 1. Create tables if they don't exist
    // Note: Drizzle usually uses migrations, but since we are using better-sqlite3 locally
    // we can execute raw SQL to create the tables if we want, or we can use drizzle-kit push.
    // For simplicity, we'll create the tables using raw SQL first.
    
    const sqlite = require('better-sqlite3')('sqlite.db');
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS brands (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS subbrands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_id TEXT NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY(brand_id) REFERENCES brands(id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS parts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        subbrand TEXT NOT NULL,
        sku TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL,
        location TEXT NOT NULL,
        image_url TEXT,
        specifications TEXT
      );
    `);

    // 2. Clear existing data to avoid duplicates on re-seed
    sqlite.exec(`DELETE FROM parts; DELETE FROM subbrands; DELETE FROM brands;`);

    // 3. Seed Brands and Subbrands
    for (const b of initialBrands) {
      await db.insert(brands).values({ id: b.id, name: b.name });
      for (const sb of b.subbrands) {
        await db.insert(subbrands).values({ brandId: b.id, name: sb });
      }
    }

    // 4. Seed Parts
    for (const p of initialParts) {
      await db.insert(parts).values({
        id: p.id,
        name: p.name,
        brand: p.brand,
        subbrand: p.subbrand,
        sku: p.sku,
        description: p.description,
        price: p.price,
        stock: p.stock,
        location: p.location,
        imageUrl: p.imageUrl || null,
        specifications: p.specifications || null
      });
    }

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
