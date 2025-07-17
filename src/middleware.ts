import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = !!token;

  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/products", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/supplier-products") ||
    pathname.startsWith("/support") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings")
  ) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", encodeURIComponent(pathname));
      return NextResponse.redirect(loginUrl);
    }
  }

  if (
    (pathname.startsWith("/login") || pathname.startsWith("/register")) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login/:path*",
    "/register/:path*",
    "/dashboard/:path*",
    "/products/:path*",
    "/supplier-products/:path*",
    "/support/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
