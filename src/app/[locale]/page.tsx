import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/supabase/safe-query";
import { ExperienceCard } from "@/components/shared/ExperienceCard";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Banknote, Star, ArrowRight, Sailboat, Mountain, TreePine } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import type { Experience, Testimonial } from "@/lib/supabase/types";
import { HeroSlideshow } from "@/components/shared/HeroSlideshow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "tr" ? "Anasayfa | Mobella Experience Travels" : "Home | Mobella Experience Travels",
    description:
      locale === "tr"
        ? "Tatil değil, deneyim. İzmir merkezli Ege ve Akdeniz deneyim turları."
        : "Not a holiday. An experience. Izmir-based Aegean & Mediterranean adventure tours.",
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const heroT = await getTranslations({ locale, namespace: "hero" });

  const supabase = await createClient();
  const [experiences, testimonials] = await Promise.all([
    safeQuery<Experience[]>(() =>
      supabase.from("experiences").select("*").eq("is_active", true).order("sort_order")
    ),
    safeQuery<Testimonial[]>(() =>
      supabase.from("testimonials").select("*").eq("is_active", true).limit(3)
    ),
  ]);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Slideshow: 5 premium Ege/Akdeniz photos with crossfade + Ken Burns */}
        <HeroSlideshow />

        {/* Gradient overlay */}
        <div className="hero-overlay absolute inset-0" style={{ zIndex: 3 }} />

        {/* Hero content */}
        <div className="relative text-center text-white px-4 max-w-3xl mx-auto" style={{ zIndex: 4 }}>
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <MapPin className="w-3.5 h-3.5" />
            İzmir · Ege · Akdeniz
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight mb-4">
            Mobella
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 font-light">
            {heroT("tagline")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/deneyimler">
              <Button
                size="lg"
                className="bg-[#FF6B47] hover:bg-[#e55a38] text-white border-0 text-base px-8 w-full sm:w-auto"
              >
                {heroT("cta_primary")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/iletisim">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#0A4D68] text-base px-8 w-full sm:w-auto bg-transparent"
              >
                {heroT("cta_secondary")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 text-xs animate-bounce" style={{ zIndex: 5 }}>
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE CARDS ─────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B47] text-sm font-semibold uppercase tracking-widest mb-2">
              {t("products_title")}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2937]">
              {locale === "tr" ? "Seçkin Deneyimler" : "Curated Experiences"}
            </h2>
          </div>

          {experiences && experiences.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {experiences.map((exp, i) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  locale={locale}
                  featured={i < 2}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              {locale === "tr" ? "Yakında..." : "Coming soon..."}
            </p>
          )}

          <div className="text-center mt-10">
            <Link href="/deneyimler">
              <Button variant="outline" className="border-[#0A4D68] text-[#0A4D68] hover:bg-[#0A4D68] hover:text-white">
                {locale === "tr" ? "Tüm Deneyimler" : "All Experiences"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY MOBELLA ──────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B47] text-sm font-semibold uppercase tracking-widest mb-2">
              {t("why_title")}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2937]">
              {locale === "tr" ? "Fark yaratan üç ilke" : "Three principles that make the difference"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-7 h-7" />,
                title: t("why_1_title"),
                desc: t("why_1_desc"),
              },
              {
                icon: <MapPin className="w-7 h-7" />,
                title: t("why_2_title"),
                desc: t("why_2_desc"),
              },
              {
                icon: <Banknote className="w-7 h-7" />,
                title: t("why_3_title"),
                desc: t("why_3_desc"),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-8 rounded-2xl border border-[#0A4D68]/10 hover:border-[#0A4D68]/30 hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 bg-[#F5E6CA] rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#0A4D68] group-hover:bg-[#0A4D68] group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-[#1F2937] text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-16 lg:py-24 bg-[#0A4D68]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl text-white mb-3">
                {t("testimonials_title")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t_item) => {
                const content =
                  locale === "tr" ? t_item.content_tr : t_item.content_en;
                const expName =
                  locale === "tr"
                    ? t_item.experience_name_tr
                    : t_item.experience_name_en;
                return (
                  <div
                    key={t_item.id}
                    className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-white"
                  >
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t_item.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#FF6B47] text-[#FF6B47]"
                        />
                      ))}
                    </div>
                    <p className="text-white/85 text-sm leading-relaxed mb-5">
                      "{content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FF6B47] flex items-center justify-center font-bold text-sm">
                        {t_item.customer_initial || t_item.customer_name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {t_item.customer_name}
                        </p>
                        {expName && (
                          <p className="text-white/50 text-xs">{expName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── COMBOS ───────────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#FF6B47] text-sm font-semibold uppercase tracking-widest mb-2">
              {t("combos_title")}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2937]">
              {locale === "tr"
                ? "Birden fazlasını yaşa"
                : "Experience more"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Sailboat className="w-6 h-6" />,
                color: "#0EA5E9",
                title: locale === "tr" ? "Çeşme + Tekne" : "Çeşme + Boat",
                desc: locale === "tr"
                  ? "Cumartesi sörf, Pazar tekne. Bedensel ve dinlendirici denge."
                  : "Saturday surfing, Sunday on the boat. Physical and restful balance.",
              },
              {
                icon: <Mountain className="w-6 h-6" />,
                color: "#0A4D68",
                title: locale === "tr" ? "Likya + Tekne" : "Lycia + Boat",
                desc: locale === "tr"
                  ? "3 gün yürüyüş, 4. gün Fethiye'den 12 Adalar tekne turu."
                  : "3 days trekking, 4th day boat tour from Fethiye to 12 Islands.",
              },
              {
                icon: <TreePine className="w-6 h-6" />,
                color: "#16A34A",
                title: locale === "tr" ? "Doğa + Tekne" : "Nature + Boat",
                desc: locale === "tr"
                  ? "Akyaka/Datça doğa turu sonrası Gökova körfezinde tekne."
                  : "Akyaka/Datça nature tour followed by a boat trip in the Gulf of Gökova.",
              },
            ].map((combo) => (
              <Link key={combo.title} href="/kombolar">
                <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4"
                    style={{ backgroundColor: combo.color }}
                  >
                    {combo.icon}
                  </div>
                  <h3 className="font-semibold text-[#1F2937] mb-2">{combo.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{combo.desc}</p>
                  <span className="text-[#FF6B47] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    {locale === "tr" ? "Fiyat Al" : "Get a Quote"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-[#F5E6CA]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1F2937] mb-2">
            {t("newsletter_title")}
          </h2>
          <p className="text-gray-600 mb-6">{t("newsletter_desc")}</p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
