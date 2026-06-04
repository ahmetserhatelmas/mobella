import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Run next-intl locale routing first (handles /giris → /tr/giris rewrites etc.)
  const intlResponse = intlMiddleware(request);

  // If next-intl issued a redirect (e.g. locale prefix normalisation), honour it
  if (intlResponse.status === 301 || intlResponse.status === 302 || intlResponse.headers.get("location")) {
    return intlResponse;
  }

  // Build a Supabase client that can read/write cookies on this response
  let supabaseResponse = intlResponse ?? NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — do not remove this
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const segments = pathname.split("/");
  const locale = ["tr", "en"].includes(segments[1]) ? segments[1] : "tr";

  // Protect /hesabim — redirect unauthenticated users to login
  if (pathname.includes("/hesabim") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/giris`;
    url.searchParams.set("from", "hesabim");
    return NextResponse.redirect(url);
  }

  // /sifre-yenile requires an active recovery session
  if (pathname.includes("/sifre-yenile") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/sifremi-unuttum`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from auth pages
  if (user && (pathname.includes("/giris") || pathname.includes("/kayit"))) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/hesabim`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run on all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
