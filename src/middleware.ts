import { NextRequest, NextResponse } from "next/server";
import type { UserRole } from "@/types/auth";
import { SESSION_COOKIE, ROLE_HOME, parseSessionCookie } from "@/lib/auth/session";

/* Routes and which roles may access them */
const PROTECTED: Array<{ prefix: string; roles: UserRole[] }> = [
  { prefix: "/dashboard",    roles: ["customer", "admin"] },
  { prefix: "/supplier",     roles: ["supplier"] },
  { prefix: "/admin",        roles: ["admin"] },
  { prefix: "/messages",     roles: ["customer", "supplier", "admin"] },
  { prefix: "/notifications",roles: ["customer", "supplier", "admin"] },
  { prefix: "/checkout",     roles: ["customer"] },
];

const AUTH_PREFIXES = ["/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const raw     = req.cookies.get(SESSION_COOKIE)?.value;
  const session = raw ? parseSessionCookie(raw) : null;

  /* Redirect already-logged-in users away from login pages */
  if (AUTH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (session) {
      return NextResponse.redirect(
        new URL(ROLE_HOME[session.role], req.url),
      );
    }
    return NextResponse.next();
  }

  /* Protect routes */
  for (const { prefix, roles } of PROTECTED) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      if (!session) {
        const dest = new URL("/login", req.url);
        dest.searchParams.set("redirect", pathname);
        return NextResponse.redirect(dest);
      }
      if (!roles.includes(session.role)) {
        /* Wrong role — send to their own home */
        return NextResponse.redirect(
          new URL(ROLE_HOME[session.role], req.url),
        );
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/supplier/:path*",
    "/admin/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/checkout/:path*",
    "/login",
    "/login/:path*",
  ],
};
