import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = ["/login", "/api/auth"];

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check session via better-auth cookie
  const sessionCookie = request.cookies.get("better-auth.session_token")?.value;
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Validate session by calling the auth API
  try {
    const response = await fetch(
      new URL("/api/auth/get-session", request.url),
      { headers: { cookie: request.headers.get("cookie") || "" } }
    );

    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const data = await response.json();
    if (!data.session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
