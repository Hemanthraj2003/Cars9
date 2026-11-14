import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brands, subbrands, parts, banners, quotations } from '@/db/schema';
import { initialBrands, initialParts, initialBanners } from '@/data/mockData';

export async function GET() {
  try {
    const sqlite = require('better-sqlite3')('sqlite.db');

    // Create tables if not exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS brands (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        logo TEXT
      );
      
      CREATE TABLE IF NOT EXISTS subbrands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_id TEXT NOT NULL,
        name TEXT NOT NULL,
        years TEXT,
        FOREIGN KEY(brand_id) REFERENCES brands(id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS parts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        subbrand TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'Accessories',
        sku TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL,
        location TEXT NOT NULL,
        image_url TEXT,
        images TEXT,
        video_url TEXT,
        compatible_years TEXT,
        badge TEXT,
        warranty_months INTEGER DEFAULT 12,
        specifications TEXT
      );

      CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subtitle TEXT,
        badge TEXT,
        image_url TEXT NOT NULL,
        cta_text TEXT DEFAULT 'Explore Accessories',
        cta_link TEXT DEFAULT '#catalog',
        is_active INTEGER NOT NULL DEFAULT 1,
        sort_order INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS quotations (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        vehicle_brand TEXT,
        vehicle_model TEXT,
        vehicle_year TEXT,
        items TEXT NOT NULL,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'New Enquiry',
        created_at TEXT NOT NULL
      );
    `);

    // Reset tables for fresh seed
    sqlite.exec(`DELETE FROM quotations; DELETE FROM banners; DELETE FROM parts; DELETE FROM subbrands; DELETE FROM brands;`);

    // 1. Seed Brands and Models (Subbrands) with Years
    for (const b of initialBrands) {
      await db.insert(brands).values({ id: b.id, name: b.name, logo: b.logo || null });
      for (const sb of b.subbrands) {
        await db.insert(subbrands).values({
          brandId: b.id,
          name: sb.name,
          years: JSON.stringify(sb.years),
        });
      }
    }

    // 2. Seed Accessories/Parts with 5-6 images and video URL
    for (const p of initialParts) {
      await db.insert(parts).values({
        id: p.id,
        name: p.name,
        brand: p.brand,
        subbrand: p.subbrand,
        category: p.category,
        sku: p.sku,
        description: p.description,
        price: p.price,
        stock: p.stock,
        location: p.location,
        imageUrl: p.imageUrl || null,
        images: JSON.stringify(p.images || [p.imageUrl]),
        videoUrl: p.videoUrl || null,
        compatibleYears: JSON.stringify(p.compatibleYears || ["All"]),
        badge: p.badge || null,
        warrantyMonths: p.warrantyMonths || 12,
        specifications: JSON.stringify(p.specifications || {}),
      });
    }

    // 3. Seed 5 Hero Banners
    for (const b of initialBanners) {
      await db.insert(banners).values({
        title: b.title,
        subtitle: b.subtitle,
        badge: b.badge || null,
        imageUrl: b.imageUrl,
        ctaText: b.ctaText || 'Explore Accessories',
        ctaLink: b.ctaLink || '#catalog',
        isActive: b.isActive,
        sortOrder: b.sortOrder,
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cars9 database seeded with brands, vehicle years, 5-slide hero banners & accessories.' 
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
