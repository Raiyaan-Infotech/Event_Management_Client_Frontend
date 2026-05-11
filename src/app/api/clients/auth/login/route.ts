import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendResponse = await fetch(`${BACKEND_URL}/vendors/client/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    let setCookieList: string[] = backendResponse.headers.getSetCookie?.() ?? [];
    if (setCookieList.length === 0) {
      const raw = backendResponse.headers.get('set-cookie');
      if (raw) setCookieList = raw.split(/,\s*(?=[a-zA-Z][a-zA-Z0-9_-]*=)/);
    }

    const cookieStore = await cookies();
    for (const cookieStr of setCookieList) {
      const parts = cookieStr.split(/;\s*/);
      const [nameValue, ...attrs] = parts;
      const eqIdx = nameValue.indexOf('=');
      if (eqIdx === -1) continue;

      const name = nameValue.slice(0, eqIdx).trim();
      const value = nameValue.slice(eqIdx + 1).trim();
      const attrMap: Record<string, string | boolean> = {};

      for (const attr of attrs) {
        const pos = attr.indexOf('=');
        if (pos === -1) attrMap[attr.toLowerCase().trim()] = true;
        else attrMap[attr.slice(0, pos).toLowerCase().trim()] = attr.slice(pos + 1).trim();
      }

      const maxAgeRaw = attrMap['max-age'];
      const maxAge = maxAgeRaw !== undefined ? parseInt(String(maxAgeRaw), 10) : undefined;

      cookieStore.set(name, value, {
        httpOnly: attrMap['httponly'] === true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        ...(maxAge !== undefined && !isNaN(maxAge) ? { maxAge } : {}),
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Client Login Error]', error);
    return NextResponse.json({ success: false, message: 'Login failed. Please try again.' }, { status: 500 });
  }
}
