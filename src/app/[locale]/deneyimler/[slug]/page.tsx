import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ExperienceCard } from "@/components/shared/ExperienceCard";
import { BookingForm } from "@/components/shared/BookingForm";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, Clock, Users, Sun, AlertCircle, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import type { Json, Experience, ExperienceDate, FAQ } from "@/lib/supabase/types";
import { safeQuery, isSupabaseConfigured } from "@/lib/supabase/safe-query";

interface ProgramDay {
  day?: string;
  title?: string;
  items?: string[];
}

export async function generateStaticParams() {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("experiences").select("slug").eq("is_active", true);
    return (data ?? []).map((e) => ({ slug: (e as { slug: string }).slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isSupabaseConfigured()) return { title: "Deneyim" };
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .eq("slug", slug)
    .single();
  const exp = data as Experience | null;

  if (!exp) return { title: "Deneyim" };
  return {
    title: locale === "tr" ? exp.name_tr : exp.name_en,
    description: locale === "tr" ? (exp.tagline_tr ?? "") : (exp.tagline_en ?? ""),
  };
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });

  if (!isSupabaseConfigured()) notFound();

  const supabase = await createClient();
  const { data: rawExp } = await supabase
    .from("experiences")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  const exp = rawExp as Experience | null;

  if (!exp) notFound();

  const today = new Date().toISOString().split("T")[0];
  const [dates, faqs, relatedExps] = await Promise.all([
    safeQuery<ExperienceDate[]>(() =>
      supabase.from("experience_dates").select("*")
        .eq("experience_id", exp!.id).eq("is_active", true)
        .gte("start_date", today).order("start_date")
    ),
    safeQuery<FAQ[]>(() =>
      supabase.from("faq").select("*")
        .or(`experience_id.eq.${exp!.id},experience_id.is.null`)
        .order("sort_order")
    ),
    safeQuery<Experience[]>(() =>
      supabase.from("experiences").select("*")
        .eq("is_active", true).neq("id", exp!.id).limit(3)
    ),
  ]);

  const name = locale === "tr" ? exp.name_tr : exp.name_en;
  const tagline = locale === "tr" ? exp.tagline_tr : exp.tagline_en;
  const description = locale === "tr" ? exp.description_tr : exp.description_en;
  const included = locale === "tr" ? exp.included_tr : exp.included_en;
  const notIncluded = locale === "tr" ? exp.not_included_tr : exp.not_included_en;
  const program = locale === "tr" ? exp.program_tr : exp.program_en;
  const season = locale === "tr" ? exp.season_tr : exp.season_en;
  const gallery = exp.gallery_urls ?? [];

  const SLUG_COVER: Record<string, string> = {
    "cesme-ruzgar-raket": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1920&q=85",
    "izmir-doga": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=85",
    "hafta-sonu-likyasi": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=85",
    "mavi-yesil-tekne": "https://images.unsplash.com/photo-1758971139390-b6b9734a45c7?w=1920&q=85",
  };
  const coverImage =
    SLUG_COVER[exp.slug] ??
    exp.cover_image_url ??
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85";

  const difficultyLabel = {
    easy: locale === "tr" ? "Kolay" : "Easy",
    medium: locale === "tr" ? "Orta" : "Moderate",
    hard: locale === "tr" ? "Zor" : "Hard",
  }[exp.difficulty ?? "easy"];

  const durationLabel =
    locale === "tr"
      ? `${exp.duration_days} gün${exp.duration_nights > 0 ? ` / ${exp.duration_nights} gece` : ""}`
      : `${exp.duration_days} day${exp.duration_days > 1 ? "s" : ""}${exp.duration_nights > 0 ? ` / ${exp.duration_nights} night${exp.duration_nights > 1 ? "s" : ""}` : ""}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end overflow-hidden">
        <Image
          src={coverImage}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 w-full pb-10 pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/deneyimler"
              className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {locale === "tr" ? "Tüm Deneyimler" : "All Experiences"}
            </Link>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                {exp.code}
              </Badge>
              {exp.difficulty && (
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                  {difficultyLabel}
                </Badge>
              )}
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-white font-semibold mb-2">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {durationLabel}
              </span>
              {exp.max_group_size && (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  max {exp.max_group_size}{" "}
                  {locale === "tr" ? "kişi" : "people"}
                </span>
              )}
              {season && (
                <span className="flex items-center gap-1">
                  <Sun className="w-4 h-4" />
                  {season}
                </span>
              )}
              <span className="font-bold text-white text-lg ml-auto">
                ₺{exp.base_price.toLocaleString("tr-TR")}
                <span className="font-normal text-sm text-white/60 ml-1">
                  /{locale === "tr" ? "kişi" : "person"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left — content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Tagline */}
            {tagline && (
              <p className="text-xl font-serif text-[#0A4D68] border-l-4 border-[#FF6B47] pl-4 leading-relaxed">
                {tagline}
              </p>
            )}

            {/* Description */}
            {description && (
              <div>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl text-[#1F2937] mb-4">{t("gallery")}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {gallery.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image
                        src={url}
                        alt={`${name} ${i + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Program */}
            {program && (
              <div>
                <h2 className="font-serif text-2xl text-[#1F2937] mb-4">{t("program")}</h2>
                <div className="space-y-4">
                  {(program as Json[]).map((day: Json, i) => {
                    const d = day as ProgramDay;
                    return (
                      <div key={i} className="border-l-2 border-[#0A4D68]/20 pl-4">
                        <h3 className="font-semibold text-[#0A4D68] mb-2">
                          {d.day || d.title || `${locale === "tr" ? "Gün" : "Day"} ${i + 1}`}
                        </h3>
                        {d.items && (
                          <ul className="space-y-1">
                            {d.items.map((item: string, j: number) => (
                              <li key={j} className="text-gray-600 text-sm flex gap-2">
                                <span className="text-[#FF6B47] mt-0.5">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Included / Not included */}
            <div className="grid sm:grid-cols-2 gap-6">
              {included && included.length > 0 && (
                <div>
                  <h2 className="font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    {t("included")}
                  </h2>
                  <ul className="space-y-2">
                    {included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {notIncluded && notIncluded.length > 0 && (
                <div>
                  <h2 className="font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    {t("not_included")}
                  </h2>
                  <ul className="space-y-2">
                    {notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Good to know */}
            <div className="bg-[#F5E6CA] rounded-2xl p-5">
              <h2 className="font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#FF6B47]" />
                {t("know_before")}
              </h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {locale === "tr" ? `Zorluk seviyesi: ${difficultyLabel}` : `Difficulty: ${difficultyLabel}`}</li>
                <li>• {locale === "tr" ? `Grup: ${exp.min_group_size}–${exp.max_group_size ?? "?"} kişi` : `Group: ${exp.min_group_size}–${exp.max_group_size ?? "?"} people`}</li>
                {season && <li>• {locale === "tr" ? `Sezon: ${season}` : `Season: ${season}`}</li>}
                <li>• {locale === "tr" ? "Sigorta fiyata dahildir." : "Insurance is included in the price."}</li>
              </ul>
            </div>

            {/* FAQ */}
            {faqs && faqs.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl text-[#1F2937] mb-4">{t("faq")}</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((faq) => {
                    const q = locale === "tr" ? faq.question_tr : faq.question_en;
                    const a = locale === "tr" ? faq.answer_tr : faq.answer_en;
                    return (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border border-gray-200 rounded-xl px-4"
                      >
                        <AccordionTrigger className="text-sm font-medium text-[#1F2937] text-left">
                          {q}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-sm">
                          {a}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            )}
          </div>

          {/* Right — booking */}
          <div>
            <BookingForm
              experienceId={exp.id}
              dates={dates ?? []}
              locale={locale}
            />
          </div>
        </div>

        {/* Related experiences */}
        {relatedExps && relatedExps.length > 0 && (
          <div className="mt-16 pt-10 border-t">
            <h2 className="font-serif text-2xl text-[#1F2937] mb-6">
              {t("related")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedExps.map((e) => (
                <ExperienceCard key={e.id} experience={e} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
