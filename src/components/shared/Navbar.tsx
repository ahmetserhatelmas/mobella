"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Mountain, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  locale: string;
}

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#0A4D68] flex items-center justify-center">
              <Mountain className="w-4 h-4 text-white" />
            </div>
            <span
              className={cn(
                "font-serif text-xl font-semibold transition-colors",
                scrolled || !isHome ? "text-[#0A4D68]" : "text-white"
              )}
            >
              Mobella
            </span>
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
            <Link href="/iletisim">
              <Button
                size="sm"
                className="bg-[#FF6B47] hover:bg-[#e55a38] text-white border-0"
              >
                {t("bookNow")}
              </Button>
            </Link>
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
                  <Link href="/" className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#0A4D68] flex items-center justify-center">
                      <Mountain className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-serif text-xl font-semibold text-[#0A4D68]">
                      Mobella
                    </span>
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
                  <div className="mt-4 pt-4 border-t">
                    <Link href="/iletisim" onClick={() => setOpen(false)}>
                      <Button className="w-full bg-[#FF6B47] hover:bg-[#e55a38] text-white">
                        {t("bookNow")}
                      </Button>
                    </Link>
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
