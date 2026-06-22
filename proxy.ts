import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/*
  Route protection (Next.js 16 renamed Middleware → Proxy).
  Optimistic cookie check only; pages/actions re-verify via the DAL.
*/

const COOKIE_NAME = "pd_session";

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return Boolean(payload?.userId);
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin (login) stays public; everything below it is protected.
  const isProtected =
    (pathname.startsWith("/admin") && pathname !== "/admin") ||
    pathname.startsWith("/api/admin");

  if (!isProtected) return NextResponse.next();

  if (await hasValidSession(req)) return NextResponse.next();

  const loginUrl = new URL("/admin", req.nextUrl);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
