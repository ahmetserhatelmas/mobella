import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sailboat, Mountain, TreePine } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "tr" ? "Kombo Paketler" : "Combo Packages",
  };
}

export default async function KombolarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "combos" });

  const combos = [
    {
      code: "KOMBO-A",
      icon: <Sailboat className="w-8 h-8" />,
      color: "#0EA5E9",
      bg: "#EFF9FF",
      title: t("combo_a_title"),
      desc: t("combo_a_desc"),
      includes:
        locale === "tr"
          ? ["Çeşme Rüzgar & Raket (2 gün)", "Mavi-Yeşil Tekne Turu (1 gün)"]
          : ["Çeşme Wind & Racket (2 days)", "Blue-Green Boat Tour (1 day)"],
      duration: locale === "tr" ? "3 gün / 2 gece" : "3 days / 2 nights",
    },
    {
      code: "KOMBO-B",
      icon: <Mountain className="w-8 h-8" />,
      color: "#0A4D68",
      bg: "#EFF6FF",
      title: t("combo_b_title"),
      desc: t("combo_b_desc"),
      includes:
        locale === "tr"
          ? ["Hafta Sonu Likyası (3 gün)", "12 Adalar Tekne Turu (1 gün)"]
          : ["Lycian Weekend (3 days)", "12 Islands Boat Tour (1 day)"],
      duration: locale === "tr" ? "4 gün / 3 gece" : "4 days / 3 nights",
    },
    {
      code: "KOMBO-C",
      icon: <TreePine className="w-8 h-8" />,
      color: "#16A34A",
      bg: "#F0FDF4",
      title: t("combo_c_title"),
      desc: t("combo_c_desc"),
      includes:
        locale === "tr"
          ? ["Muğla Doğa: Akyaka & Datça (2 gün)", "Gökova Tekne Turu (1 gün)"]
          : ["Muğla Nature: Akyaka & Datça (2 days)", "Gökova Boat Tour (1 day)"],
      duration: locale === "tr" ? "3 gün / 2 gece" : "3 days / 2 nights",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-[#0A4D68] pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-white text-center">
          <h1 className="font-serif text-4xl sm:text-5xl mb-3">{t("title")}</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        {combos.map((combo) => (
          <div
            key={combo.code}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
          >
            <div className="flex flex-col md:flex-row">
              <div
                className="md:w-72 p-8 flex flex-col items-center justify-center text-center"
                style={{ backgroundColor: combo.bg }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4"
                  style={{ backgroundColor: combo.color }}
                >
                  {combo.icon}
                </div>
                <h2 className="font-serif text-xl font-semibold text-[#1F2937] mb-1">
                  {combo.title}
                </h2>
                <span className="text-sm text-gray-500">{combo.duration}</span>
              </div>

              <div className="flex-1 p-8">
                <p className="text-gray-600 mb-5 leading-relaxed">{combo.desc}</p>
                <div className="mb-6">
                  <p className="text-sm font-semibold text-[#1F2937] mb-2">
                    {locale === "tr" ? "Dahil deneyimler:" : "Included experiences:"}
                  </p>
                  <ul className="space-y-1">
                    {combo.includes.map((inc, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B47]" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/iletisim">
                  <Button
                    className="bg-[#FF6B47] hover:bg-[#e55a38] text-white"
                  >
                    {t("inquire")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
