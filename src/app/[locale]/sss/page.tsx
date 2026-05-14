import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Metadata } from "next";
import type { FAQ } from "@/lib/supabase/types";
import { safeQuery } from "@/lib/supabase/safe-query";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "tr" ? "SSS | Mobella" : "FAQ | Mobella" };
}

export default async function SSSPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  const supabase = await createClient();
  const faqs = await safeQuery<FAQ[]>(() =>
    supabase.from("faq").select("*").is("experience_id", null).order("sort_order")
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-[#0A4D68] pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-white text-center">
          <h1 className="font-serif text-4xl sm:text-5xl mb-3">{t("title")}</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        {faqs && faqs.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => {
              const q = locale === "tr" ? faq.question_tr : faq.question_en;
              const a = locale === "tr" ? faq.answer_tr : faq.answer_en;
              return (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-white border border-gray-200 rounded-xl px-5 shadow-sm"
                >
                  <AccordionTrigger className="text-base font-medium text-[#1F2937] text-left py-4">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p className="text-center text-gray-400">
            {locale === "tr" ? "Yakında eklenecek." : "Coming soon."}
          </p>
        )}
      </div>
    </div>
  );
}
