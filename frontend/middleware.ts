import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res }, {
      supabaseUrl: "https://elemiywbemevklssilhz.supabase.co",
      supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZW1peXdiZW1ldmtsc3NpbGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDk0NjIsImV4cCI6MjA3OTcyNTQ2Mn0.OYNcFKygWDgQ0ywg_lm7bCaLwNv_Nq5Yuppn0koMv_s"
  })

  const { data: { session } } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname;

  // Check if path is protected
  // Protected routes: /dashboard, /en/dashboard, /fr/dashboard...
  const isProtected = path.includes('/dashboard');
  const isAuthPage = path.includes('/login');
  const isRoot = path === '/' || path === '/en' || path === '/fr' || path === '/es' || path === '/it';
  const isPricing = path.includes('/pricing');

  // Redirect to login if protected and no session
  if (isProtected && !session) {
      const locale = req.nextUrl.pathname.split('/')[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Redirect to dashboard if logged in and on login/root/pricing page?
  // Maybe not root/pricing, but definitely login
  if (isAuthPage && session) {
      const locale = req.nextUrl.pathname.split('/')[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  // Handle I18n routing
  const response = intlMiddleware(req);
  
  return response;
}

export const config = {
  matcher: ['/', '/(fr|en|es|it)/:path*']
};
