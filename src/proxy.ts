import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Skip auth check for the OAuth callback route to prevent interference with code exchange
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return supabaseResponse;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (
      !user &&
      !request.nextUrl.pathname.startsWith('/auth') &&
      request.nextUrl.pathname !== '/' &&
      request.nextUrl.pathname !== '/404'
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth';
      return NextResponse.redirect(url);
    }
  } catch {
    // getUser can fail if tokens are invalid/expired — allow through, client will handle
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
