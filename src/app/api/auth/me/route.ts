import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ user: null });
    }

    // Decode from base64
    const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf8');
    const user = JSON.parse(decoded);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching current user session:', error);
    return NextResponse.json({ user: null });
  }
}
