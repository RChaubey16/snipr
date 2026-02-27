import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login"];

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  const { pathname } = request.nextUrl;

  const isAuthenticated = await verifyToken(token);

  // Logged in user trying to access login page → redirect to dashboard
  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated user trying to access protected page → redirect to login
  if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) {
    console.log('No token found');
    return false;
  }

  try {
    const result = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    console.log('Token valid:', result.payload);
    return true;
  } catch (error) {
    console.log('Token verification failed:', error);
    return false;
  }
}
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
