import { NextResponse } from 'next/server';

/**
 * GET /api/logout
 * Clears all client HttpOnly cookies server-side, then redirects to /login.
 * Used when the 401 interceptor can't clear HttpOnly cookies via JS.
 */
export async function GET(request: Request) {
  const fallbackOrigin = new URL(request.url).origin;
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || (fallbackOrigin.startsWith('https') ? 'https' : 'http');
  const baseUrl = forwardedHost
    ? `${forwardedProto}://${forwardedHost.split(',')[0].trim()}`
    : fallbackOrigin;
  const response = NextResponse.redirect(new URL('/login', baseUrl));

  const isProduction = process.env.NODE_ENV === 'production';
  const clearOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    maxAge: 0,
  };

  response.cookies.set({ name: 'client_access_token',  value: '', ...clearOptions });
  response.cookies.set({ name: 'client_refresh_token', value: '', ...clearOptions });
  response.cookies.set({ name: 'client_auth_pending',  value: '', httpOnly: false, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', path: '/', maxAge: 0 });

  return response;
}
