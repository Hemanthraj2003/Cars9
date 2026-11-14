import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const defaultSettings: Record<string, any> = {
  // Passwords (internal defaults)
  admin_password: "cars9pass",
  staff_password: "cars9staff",

  // PLP Settings (All on/off switches)
  plp_showQuickPreview: true,
  plp_showCouplerBadge: true,
  plp_showMediaCountPill: true,
  plp_showCategoryTabs: true,
  plp_showVehicleCascade: true,
  plp_showBadges: true,
  plp_enableHoverZoom: true,

  // PDP Settings (All on/off switches)
  pdp_showCadSchematic: true,
  pdp_showVideoPlayer: true,
  pdp_showWhatsAppEnquiry: true,
  pdp_showDirectShareLink: true,
  pdp_showQuantitySelector: true,
  pdp_showCompatibilityBanner: true,
  pdp_showBayTimeEstimate: true,
  pdp_showSpecsTab: true,
  pdp_showWhatsInBoxTab: true,
  pdp_showInstallationProtocolTab: true,
  pdp_showRelatedProducts: true,
};

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    const rows = await db.select().from(siteSettings);
    
    const settings = { ...defaultSettings };
    for (const r of rows) {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch {
        settings[r.key] = r.value;
      }
    }

    // Security: Never leak passwords to public storefront visitors
    if (!session || session.role !== "admin") {
      delete settings.admin_password;
      delete settings.staff_password;
    }

    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error: any) {
    console.error('Failed to get settings from db, returning defaults:', error);
    const safeDefaults = { ...defaultSettings };
    delete safeDefaults.admin_password;
    delete safeDefaults.staff_password;

    return NextResponse.json(safeDefaults, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json();

    for (const [key, val] of Object.entries(updates)) {
      const strVal = typeof val === 'string' ? val : JSON.stringify(val);
      try {
        // Try delete then insert for universal compatibility across MySQL and SQLite
        await db.delete(siteSettings).where(eq(siteSettings.key, key));
        await db.insert(siteSettings).values({ key, value: strVal });
      } catch (err) {
        console.error(`Error saving setting ${key}:`, err);
      }
    }

    // Return merged updated settings
    const rows = await db.select().from(siteSettings);
    const settings = { ...defaultSettings };
    for (const r of rows) {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch {
        settings[r.key] = r.value;
      }
    }

    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error: any) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
