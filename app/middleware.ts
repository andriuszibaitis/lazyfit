import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const protectedPaths = ["/profilis", "/nustatymai"];
  const adminPaths = ["/admin"];
  const path = request.nextUrl.pathname;

  const isProtectedPath = protectedPaths.some(
    (protectedPath) =>
      path === protectedPath || path.startsWith(`${protectedPath}/`)
  );

  const isAdminPath = adminPaths.some(
    (adminPath) => path === adminPath || path.startsWith(`${adminPath}/`)
  );

  if (isProtectedPath && !token) {
    const url = new URL("/auth/prisijungti", request.url);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  if (isAdminPath) {
    if (!token) {
      const url = new URL("/auth/prisijungti", request.url);
      url.searchParams.set("callbackUrl", "/");
      return NextResponse.redirect(url);
    }

    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (token && (path.startsWith("/auth/") || path === "/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profilis/:path*",
    "/nustatymai/:path*",
    "/auth/:path*",
    "/admin/:path*",
  ],
};
