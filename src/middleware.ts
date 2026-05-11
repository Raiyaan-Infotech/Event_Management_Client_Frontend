import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Guest-only routes (logged-in users → /dashboard)
const guestOnlyRoutes = ['/login', '/forgot-password', '/reset-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const clientAccessToken  = request.cookies.get('client_access_token')?.value;
  const clientRefreshToken = request.cookies.get('client_refresh_token')?.value;
  const clientAuthPending  = request.cookies.get('client_auth_pending')?.value === 'true';
  const isClientLoggedIn   = !!(clientAccessToken || clientRefreshToken || clientAuthPending);

  // Root → redirect
  if (pathname === '/') {
    return isClientLoggedIn
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.redirect(new URL('/login', request.url));
  }

  // Already logged in, redirect away from guest-only pages
  if (guestOnlyRoutes.some((route) => pathname.startsWith(route)) && isClientLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Not logged in → login page
  const isPublicRoute = guestOnlyRoutes.some((route) => pathname.startsWith(route));
  if (!isPublicRoute && !isClientLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|api).*)'],
};

