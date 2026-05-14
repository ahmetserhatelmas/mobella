import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ExperienceCard } from "@/components/shared/ExperienceCard";
import type { Experience } from "@/lib/supabase/types";
import { safeQuery } from "@/lib/supabase/safe-query";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "tr" ? "Deneyimler" : "Experiences",
    description:
      locale === "tr"
        ? "Tüm Mobella deneyimleri — sörf, yürüyüş, tekne turu ve daha fazlası."
        : "All Mobella experiences — surfing, trekking, boat tours and more.",
  };
}

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experiences_page" });

  const supabase = await createClient();
  const experiences = await safeQuery<Experience[]>(() =>
    supabase.from("experiences").select("*").eq("is_active", true).order("sort_order")
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#0A4D68] pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-white text-center">
          <h1 className="font-serif text-4xl sm:text-5xl mb-3">{t("title")}</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {experiences && experiences.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg">
              {locale === "tr" ? "Deneyimler yakında eklenecek." : "Experiences coming soon."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
