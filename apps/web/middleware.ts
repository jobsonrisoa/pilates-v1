import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for tokens in cookies (preferred) or Authorization header (fallback)
  const refreshToken = request.cookies.get('refreshToken');
  const accessTokenCookie = request.cookies.get('accessToken');
  const accessTokenHeader = request.headers.get('authorization');
  const hasToken = refreshToken || accessTokenCookie || accessTokenHeader;
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !hasToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing login page while authenticated
  if (isAuthPage && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
