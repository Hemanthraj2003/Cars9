import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

const JWT_SECRET = process.env.JWT_SECRET || "cars9-super-secret-studio-jwt-key-2026-production";
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // 1. Only inspect API routes
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 2. Allow public auth endpoints
  if (
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/api/auth/me")
  ) {
    return NextResponse.next();
  }

  // 3. Allow public customer quotation submission (POST /api/quotations)
  if (pathname === "/api/quotations" && method === "POST") {
    return NextResponse.next();
  }

  // 4. Allow public GET requests for storefront viewing
  // (catalog parts, vehicle brands, hero banners, image proxy, public settings)
  if (method === "GET") {
    // Only /api/seed should be restricted on GET in production
    if (pathname.startsWith("/api/seed")) {
      const session = await getSessionFromCookie(request);
      if (!session || session.role !== "admin") {
        return NextResponse.json({ error: "Forbidden: Seed route is restricted" }, { status: 403 });
      }
    }
    return NextResponse.next();
  }

  // 5. All mutating methods (POST, PUT, DELETE, PATCH) on remaining API routes require authentication
  const session = await getSessionFromCookie(request);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Protected studio endpoint. Valid session required." },
      { status: 401 }
    );
  }

  // 6. Role-Based Access Control (RBAC)
  // Staff is ONLY permitted to mutate enquiries (/api/quotations) and warranties (/api/warranties)
  const isStaffAllowedRoute =
    pathname.startsWith("/api/quotations") ||
    pathname.startsWith("/api/warranties") ||
    pathname.startsWith("/api/upload");

  if (session.role === "staff" && !isStaffAllowedRoute) {
    return NextResponse.json(
      { error: "Forbidden: Full Admin access required for catalog, brands, banners, and settings." },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

async function getSessionFromCookie(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, key, {
      algorithms: ["HS256"],
    });
    return payload as { username: string; role: "admin" | "staff" };
  } catch {
    return null;
  }
}

export const config = {
  matcher: [
    "/api/:path*",
  ],
};
