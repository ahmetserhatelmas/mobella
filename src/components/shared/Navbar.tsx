"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Globe, User, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface NavbarProps {
  locale: string;
}

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "";

  const navLinks = [
    { href: "/deneyimler", label: t("experiences") },
    { href: "/kombolar", label: t("combos") },
    { href: "/hikaye", label: t("story") },
    { href: "/rehber", label: t("guide") },
    { href: "/sss", label: t("faq") },
    { href: "/iletisim", label: t("contact") },
  ];

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src={!scrolled && isHome ? "/mobella-logo-light.png" : "/mobella-logo.png"}
              alt="Mobella"
              width={140}
              height={56}
              className="h-12 lg:h-14 w-auto object-contain transition-all"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as Parameters<typeof Link>[0]["href"]}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#FF6B47]",
                  scrolled || !isHome
                    ? "text-[#1F2937]"
                    : "text-white/90 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language switcher */}
            <Link
              href="/"
              locale={locale === "tr" ? "en" : "tr"}
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors",
                scrolled || !isHome ? "text-[#1F2937]" : "text-white/80"
              )}
            >
              <Globe className="w-4 h-4" />
              {locale === "tr" ? "EN" : "TR"}
            </Link>

            {user ? (
              /* User is logged in */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors px-3 py-1.5 rounded-full border",
                    scrolled || !isHome
                      ? "border-gray-200 text-[#1F2937] hover:border-[#0A4D68]/40"
                      : "border-white/30 text-white hover:border-white/60"
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-[#FF6B47] flex items-center justify-center text-white text-xs font-bold uppercase">
                    {displayName.charAt(0) || <User className="w-3 h-3" />}
                  </div>
                  <span className="max-w-24 truncate">{displayName}</span>
                </button>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                      <Link
                        href="/hesabim"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-[#1F2937] hover:bg-[#F5E6CA] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#0A4D68]" />
                        {t("myAccount")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("logout") ?? "Çıkış"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Not logged in */
              <>
                <Link
                  href="/giris"
                  className={cn(
                    "text-sm font-medium transition-colors",
                    scrolled || !isHome ? "text-[#1F2937] hover:text-[#FF6B47]" : "text-white/80 hover:text-white"
                  )}
                >
                  {t("login")}
                </Link>
                <Link href="/iletisim">
                  <Button
                    size="sm"
                    className="bg-[#FF6B47] hover:bg-[#e55a38] text-white border-0"
                  >
                    {t("bookNow")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/"
              locale={locale === "tr" ? "en" : "tr"}
              className={cn(
                "text-sm font-medium",
                scrolled || !isHome ? "text-[#1F2937]" : "text-white"
              )}
            >
              {locale === "tr" ? "EN" : "TR"}
            </Link>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    "p-2",
                    scrolled || !isHome ? "text-[#1F2937]" : "text-white"
                  )}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-1 mt-8">
                  <Link href="/" className="flex items-center mb-6">
                    <Image
                      src="/mobella-logo.png"
                      alt="Mobella"
                      width={110}
                      height={44}
                      className="h-9 w-auto object-contain"
                    />
                  </Link>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href as Parameters<typeof Link>[0]["href"]}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-3 text-[#1F2937] hover:text-[#FF6B47] hover:bg-[#F5E6CA] rounded-lg transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-4 pt-4 border-t space-y-2">
                    {user ? (
                      <>
                        <Link href="/hesabim" onClick={() => setOpen(false)}>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            {t("myAccount")}
                          </Button>
                        </Link>
                        <button
                          onClick={() => { handleLogout(); setOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          {t("logout") ?? "Çıkış"}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/giris" onClick={() => setOpen(false)}>
                          <Button variant="outline" className="w-full">
                            {t("login")}
                          </Button>
                        </Link>
                        <Link href="/iletisim" onClick={() => setOpen(false)}>
                          <Button className="w-full bg-[#FF6B47] hover:bg-[#e55a38] text-white">
                            {t("bookNow")}
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
