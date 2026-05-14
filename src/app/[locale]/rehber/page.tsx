import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "tr" ? "Rehber | Mobella" : "Guide | Mobella" };
}

const guides =
  [
    {
      slug: "likya-yolu-hazirlik",
      title_tr: "Likya Yolu'na Nasıl Hazırlanırsın?",
      title_en: "How to Prepare for the Lycian Way",
      date: "2026-04-10",
      readTime: "5",
      category_tr: "Hazırlık",
      category_en: "Preparation",
      excerpt_tr:
        "Doğru ayakkabı seçiminden yanında getirmen gerekenlere kadar eksiksiz rehber.",
      excerpt_en:
        "From choosing the right shoes to what to pack — a complete guide.",
    },
    {
      slug: "cesme-ruzgar-surfu",
      title_tr: "Çeşme'de Rüzgar Sörfüne Başlamak",
      title_en: "Getting Started with Windsurfing in Çeşme",
      date: "2026-03-22",
      readTime: "4",
      category_tr: "Aktivite",
      category_en: "Activity",
      excerpt_tr:
        "İlk derste ne beklenmeli? Hangi sezon en iyisi? Pratik bilgiler.",
      excerpt_en:
        "What to expect in your first lesson? Which season is best? Practical advice.",
    },
    {
      slug: "tekne-turu-koy-rehberi",
      title_tr: "Ege'nin Saklı Koyları: Neden Kalabalık Turları Seçmemeli?",
      title_en: "Aegean's Hidden Coves: Why You Should Avoid Crowded Tours",
      date: "2026-03-05",
      readTime: "6",
      category_tr: "İpuçları",
      category_en: "Tips",
      excerpt_tr:
        "Gidilmemiş koyları bulmanın sırrı — ve Mobella'nın rotaları neden farklı.",
      excerpt_en:
        "The secret to finding untouched coves — and why Mobella's routes are different.",
    },
  ];

export default async function RehberPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guide" });

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-[#0A4D68] pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-white text-center">
          <h1 className="font-serif text-4xl sm:text-5xl mb-3">{t("title")}</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid gap-6">
          {guides.map((g) => {
            const title = locale === "tr" ? g.title_tr : g.title_en;
            const excerpt = locale === "tr" ? g.excerpt_tr : g.excerpt_en;
            const category = locale === "tr" ? g.category_tr : g.category_en;
            return (
              <article
                key={g.slug}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold bg-[#F5E6CA] text-[#0A4D68] px-3 py-1 rounded-full">
                    {category}
                  </span>
                  <span className="text-xs text-gray-400">{g.date}</span>
                  <span className="text-xs text-gray-400">
                    {g.readTime} {locale === "tr" ? "dk okuma" : "min read"}
                  </span>
                </div>
                <h2 className="font-serif text-xl text-[#1F2937] mb-2 leading-snug">
                  {title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{excerpt}</p>
                <span className="text-[#FF6B47] text-sm font-medium">
                  {locale === "tr" ? "Devamını Oku →" : "Read More →"}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
