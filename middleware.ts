import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });
  const { pathname } = request.nextUrl;

  // Public routes
  const publicPaths = ["/signin", "/register"];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  // If user is logged in and goes to signin/register -> redirect to dashboard
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is NOT logged in and tries to access anything except signin/register
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
