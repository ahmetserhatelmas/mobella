import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "tr" ? "Hikaye | Mobella" : "Story | Mobella" };
}

export default async function HikayePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "story" });

  const content =
    locale === "tr"
      ? {
          heading: "Mobella Nasıl Doğdu?",
          p1: "Her şey bir hafta sonu yürüyüşünde başladı. Likya yolunda, 12 kişilik kalabalık bir rehberli turla yürürken fark ettik ki etrafımızdaki manzarayla değil, birbirimizle konuşmaya vakıt bile bulamıyorduk.",
          p2: "Bu deneyimden sonra kendimize sorduk: İnsanların gerçekten istediği nedir? Otobüse binmek ve rehber dinlemek mi, yoksa rüzgarı hissetmek, yürümek, denizi tatmak mı?",
          p3: "Cevabımız netti. Mobella'yı kurduğumuzda tek bir ilke belirledik: Tatil değil, deneyim. İzmir, Ege ve Akdeniz'in bu eşsiz coğrafyasını küçük gruplarla, yerel rehberlerle ve dürüst fiyatlarla keşfettirmek.",
          p4: "Adımız 'Mo' ve 'bella'dan geliyor — hareket ve güzellik. Muğla'nın tarihi Mobella kalesinden esinlendik. Bu iki kavramı birleştirdiğimizde Mobella ortaya çıktı: güzel yolculuklar.",
          quote: "\"Hareket edeni depresyon yakalayamaz. Yaşa. Hatırla.\"",
          values_title: "Değerlerimiz",
          values: [
            { title: "Hareket", desc: "Pasif tatil değil aktif deneyim. Her ürün bedensel bir eylem içerir." },
            { title: "Yerellik", desc: "Yerel rehberler, yerel üreticiler, yerel mekanlar." },
            { title: "Şeffaflık", desc: "Fiyatlar, dahil olanlar, dahil olmayanlar baştan açık." },
            { title: "Sürdürülebilirlik", desc: "Düşük etkili turizm. Doğayı koruyarak gezip yaşıyoruz." },
          ],
        }
      : {
          heading: "How Mobella Was Born",
          p1: "It all started on a weekend trek. Walking the Lycian Way with a guided group of 12, we realized we didn't even have time to talk to each other — let alone take in the landscape.",
          p2: "After that experience, we asked ourselves: what do people actually want? To sit on a bus and listen to a guide, or to feel the wind, walk the earth, taste the sea?",
          p3: "The answer was clear. When we founded Mobella, we set one principle: not a holiday — an experience. Discovering the unique geography of İzmir, the Aegean, and the Mediterranean in small groups, with local guides, and honest prices.",
          p4: "Our name comes from 'Mo' and 'bella' — movement and beauty. We drew inspiration from the historic Mobella castle in Muğla. Combining these two concepts gave us Mobella: beautiful journeys.",
          quote: "\"Movement keeps depression at bay. Live it. Remember it.\"",
          values_title: "Our Values",
          values: [
            { title: "Movement", desc: "Active experiences, not passive holidays. Every product includes a physical action." },
            { title: "Locality", desc: "Local guides, local producers, local venues." },
            { title: "Transparency", desc: "Prices, inclusions, and exclusions are clear from the start." },
            { title: "Sustainability", desc: "Low-impact tourism. We explore while protecting nature." },
          ],
        };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80"
          alt="Mobella hikayesi"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 h-full flex items-center justify-center pt-16">
          <h1 className="font-serif text-5xl text-white">{t("title")}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2937] mb-8">
          {content.heading}
        </h2>

        <div className="space-y-5 text-gray-600 leading-relaxed">
          <p>{content.p1}</p>
          <p>{content.p2}</p>
          <p>{content.p3}</p>
          <p>{content.p4}</p>
        </div>

        <blockquote className="my-10 border-l-4 border-[#FF6B47] pl-6 py-2">
          <p className="font-serif text-xl text-[#0A4D68] italic">{content.quote}</p>
        </blockquote>

        {/* Values */}
        <h3 className="font-serif text-2xl text-[#1F2937] mb-6 mt-10">
          {content.values_title}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {content.values.map((v) => (
            <div key={v.title} className="bg-[#FAFAF8] rounded-xl p-5 border border-gray-100">
              <h4 className="font-semibold text-[#0A4D68] mb-1">{v.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
