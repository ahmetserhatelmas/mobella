import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const pages = [
    { href: "/deneyimler", label: nav("experiences") },
    { href: "/kombolar", label: nav("combos") },
    { href: "/hikaye", label: nav("story") },
    { href: "/rehber", label: nav("guide") },
    { href: "/sss", label: nav("faq") },
    { href: "/iletisim", label: nav("contact") },
  ];

  const legal = [
    { href: "/kurumsal", label: t("kvkk") },
    { href: "/kurumsal", label: t("cookies") },
    { href: "/kurumsal", label: t("terms") },
  ];

  return (
    <footer className="bg-[#1F2937] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/mobella-logo.png"
                alt="Mobella"
                width={120}
                height={48}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              {t("tagline")}
            </p>
            <p className="text-white/40 text-xs">{t("tursab")}: A-XXXX</p>
            {/* Social */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6B47] transition-colors text-xs font-bold"
              >
                IG
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6B47] transition-colors text-xs font-bold"
              >
                FB
              </a>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              {t("pages")}
            </h4>
            <ul className="space-y-2">
              {pages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href as Parameters<typeof Link>[0]["href"]}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              {t("legal")}
            </h4>
            <ul className="space-y-2">
              {legal.map((item, i) => (
                <li key={i}>
                  <Link
                    href="/kurumsal"
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
              İletişim
            </h4>
            <address className="not-italic space-y-2 text-white/70 text-sm">
              <p>İzmir / Muğla, Türkiye</p>
              <a
                href="mailto:info@mobella.com"
                className="hover:text-white transition-colors block"
              >
                info@mobella.com
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905001234567"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors block"
              >
                +90 500 123 45 67
              </a>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-white/30 text-xs">
          <p>© {new Date().getFullYear()} Mobella Experience Travels. {t("rights")}</p>
          <p>Mobella Deneyim ve Serüven Turları</p>
        </div>
      </div>
    </footer>
  );
}
