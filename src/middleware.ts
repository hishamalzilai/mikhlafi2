import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

function generateNonce(): string {
  // crypto.randomUUID is available in Edge and Node.js runtimes
  return crypto.randomUUID();
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ''} https://www.google-analytics.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    `img-src 'self' data: blob: https://images.unsplash.com ${supabaseUrl} https://www.mofa-ye.org https://s0.wp.com https://*.youtube.com https://*.ytimg.com https://img.youtube.com https://i.ytimg.com https://yt3.ggpht.com`,
    `media-src 'self' blob: ${supabaseUrl} https://*.youtube.com`,
    `connect-src 'self' ${supabaseUrl} https://*.supabase.co https://sup.hazlinkdata.cloud https://www.google-analytics.com`,
    `frame-src 'self' ${supabaseUrl} https://*.youtube.com https://www.youtube-nocookie.com`,
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "block-all-mixed-content",
    "upgrade-insecure-requests",
  ].join('; ');
}

function setContentSecurityPolicy(response: NextResponse, nonce: string) {
    response.headers.set('Content-Security-Policy', buildCsp(nonce));
    return response;
}

function redirectWithCookies(url: URL, currentResponse: NextResponse, nonce: string) {
    const redirectResponse = NextResponse.redirect(url);
    currentResponse.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return setContentSecurityPolicy(redirectResponse, nonce);
}

export async function middleware(request: NextRequest) {
    // Set a per-request CSP nonce so inline scripts loaded by Next.js are allowed
    // while blocking arbitrary injected scripts.
    const nonce = generateNonce();
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    let response = NextResponse.next({ request: { headers: requestHeaders } });

    const pathname = request.nextUrl.pathname;
    const isAdminPage = pathname.startsWith('/hq-management-system');

    if (isAdminPage) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
          cookieOptions: {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          },
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
              response = NextResponse.next({ request: { headers: requestHeaders } });
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, {
                  ...options,
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'lax',
                });
              });
            },
          },
        });

        const { data, error } = await supabase.auth.getUser();
        const isAdmin = !error && data.user?.app_metadata?.role === 'admin';
        const isLoginPage = pathname === '/hq-management-system/login';

        if (!isAdmin && !isLoginPage) {
          const loginUrl = request.nextUrl.clone();
          loginUrl.pathname = '/hq-management-system/login';
          loginUrl.search = '';
          return redirectWithCookies(loginUrl, response, nonce);
        }

        if (isAdmin && isLoginPage) {
          const dashboardUrl = request.nextUrl.clone();
          dashboardUrl.pathname = '/hq-management-system';
          dashboardUrl.search = '';
          return redirectWithCookies(dashboardUrl, response, nonce);
        }
      } else if (pathname !== '/hq-management-system/login') {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/hq-management-system/login';
        loginUrl.search = '';
        return redirectWithCookies(loginUrl, response, nonce);
      }
    }

    return setContentSecurityPolicy(response, nonce);
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
