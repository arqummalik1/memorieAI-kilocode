import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    console.error('[Auth Callback] No authorization code provided');
    return NextResponse.redirect(
      new URL('/auth?error=Authentication failed: no authorization code received', origin)
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[Auth Callback] Code exchange failed:', error.message);
      return NextResponse.redirect(
        new URL(`/auth?error=${encodeURIComponent(error.message)}`, origin)
      );
    }

    return NextResponse.redirect(new URL(next, origin));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown authentication error';
    console.error('[Auth Callback] Unexpected error:', message);
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(message)}`, origin)
    );
  }
}
