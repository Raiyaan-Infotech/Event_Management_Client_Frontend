import { NextResponse } from 'next/server';

/**
 * GET /api/logout
 * Clears all client HttpOnly cookies server-side, then redirects to /login.
 * Used when the 401 interceptor can't clear HttpOnly cookies via JS.
 */
export async function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;
  const response = NextResponse.redirect(new URL('/login', baseUrl));

  const clearOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };

  response.cookies.set({ name: 'client_access_token',  value: '', ...clearOptions });
  response.cookies.set({ name: 'client_refresh_token', value: '', ...clearOptions });
  response.cookies.set({ name: 'client_auth_pending',  value: '', httpOnly: false, secure: false, sameSite: 'lax', path: '/', maxAge: 0 });

  return response;
}
