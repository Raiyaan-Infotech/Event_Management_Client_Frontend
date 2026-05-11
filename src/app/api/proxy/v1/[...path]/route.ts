import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const PORTAL_TYPE = 'client';
const ALLOWED_COOKIE_NAMES = new Set(["client_access_token","client_refresh_token"]);
const PROXY_TIMEOUT_MS = 25000;

async function forwardRequest(request: NextRequest, path: string, method: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  try {
    const strippedPath = path.startsWith('v1/') ? path.slice(3) : path;
    const searchParams = request.nextUrl.search;
    const backendUrl = `${BACKEND_URL}/${strippedPath}${searchParams}`;

    let body: BodyInit | undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.blob();
    }

    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('connection');
    headers.delete('content-length');

    // Force backend mail/auth context for this frontend app.
    headers.set('x-portal-type', PORTAL_TYPE);

    // localhost shares cookies across ports. Forward only this portal's auth cookies.
    const portalCookies = request.cookies
      .getAll()
      .filter((cookie) => ALLOWED_COOKIE_NAMES.has(cookie.name));

    if (portalCookies.length > 0) {
      headers.set('cookie', portalCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; '));
    } else {
      headers.delete('cookie');
    }

    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body,
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Proxy:${PORTAL_TYPE}] Forwarding ${method} to ${backendUrl}`);
    }

    const responseHeaders = new Headers();
    backendResponse.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'set-cookie'].includes(lowerKey)) {
        responseHeaders.append(key, value);
      }
    });

    const setCookieHeaders = backendResponse.headers.getSetCookie?.();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie) => responseHeaders.append('Set-Cookie', cookie));
    }

    const responseData = await backendResponse.blob();
    return new NextResponse(responseData, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[API Proxy Error]', error);
    return NextResponse.json(
      { success: false, message: 'Proxy request failed: Backend unreachable or timed out' },
      { status: 504 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  return forwardRequest(request, pathArray.join('/'), 'GET');
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  return forwardRequest(request, pathArray.join('/'), 'POST');
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  return forwardRequest(request, pathArray.join('/'), 'PUT');
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  return forwardRequest(request, pathArray.join('/'), 'PATCH');
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  return forwardRequest(request, pathArray.join('/'), 'DELETE');
}

export async function HEAD(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  return forwardRequest(request, pathArray.join('/'), 'HEAD');
}

export async function OPTIONS(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  return forwardRequest(request, pathArray.join('/'), 'OPTIONS');
}
