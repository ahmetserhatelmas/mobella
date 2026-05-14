import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "tr" ? "Kurumsal | Mobella" : "Corporate | Mobella" };
}

export default async function KurumsalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "corporate" });

  const sections =
    locale === "tr"
      ? [
          {
            id: "sirket",
            title: "Şirket Bilgileri",
            content: `Mobella Deneyim ve Serüven Turları
Kuruluş: İzmir / Muğla, Türkiye
TÜRSAB Acente Belgesi: A grubu, belge no: A-XXXX (başvuru aşamasında)
İletişim: info@mobella.com`,
          },
          {
            id: "kvkk",
            title: "KVKK — Kişisel Verilerin Korunması",
            content: `Mobella Deneyim ve Serüven Turları olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizi gizlilik ve güvenlik ilkeleriyle işlemekteyiz.

Toplanan Veriler: Ad soyad, e-posta adresi, telefon numarası, rezervasyon bilgileri.
Kullanım Amacı: Rezervasyon yönetimi, müşteri iletişimi, bülten gönderimleri (onay gerektirir).
Saklama Süresi: Yasal süre veya hizmet ilişkisinin sona erdiği tarihten itibaren en fazla 2 yıl.
Haklarınız: KVKK kapsamında verilerinize erişim, düzeltme, silme ve işlemeye itiraz hakkına sahipsiniz.

Başvuru için: info@mobella.com`,
          },
          {
            id: "cerez",
            title: "Çerez Politikası",
            content: `Web sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerez kullanmaktadır.

Zorunlu Çerezler: Site işlevselliği için gereklidir; kapatılamaz.
Analitik Çerezler: Google Analytics 4 aracılığıyla ziyaretçi davranışlarını anonimleştirilmiş şekilde ölçeriz.
Tercih Çerezleri: Dil tercihinizi hatırlamak için kullanılır.

Çerez tercihlerinizi tarayıcı ayarlarından değiştirebilirsiniz.`,
          },
          {
            id: "kullanim",
            title: "Kullanım Şartları",
            content: `Bu web sitesini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız:

1. Sitedeki tüm içerikler Mobella'nın mülkiyetindedir; izinsiz kopyalanamaz.
2. Rezervasyon talepleri, Mobella tarafından telefon veya e-posta ile teyit edilmeden kesinleşmez.
3. İptal koşulları: Tura 7 günden fazla kala tam iade, 3–7 gün arası %50 iade, 3 günden az kala iade yapılmaz.
4. Mobella, mücbir sebeplerle (hava koşulları, doğal afetler vb.) tur programında değişiklik yapma hakkını saklı tutar.`,
          },
        ]
      : [
          {
            id: "company",
            title: "Company Information",
            content: `Mobella Experience and Adventure Tours
Founded in: İzmir / Muğla, Turkey
TÜRSAB Travel Agency Certificate: Group A, license no: A-XXXX (application in progress)
Contact: info@mobella.com`,
          },
          {
            id: "privacy",
            title: "Privacy Policy (KVKK)",
            content: `At Mobella Experience and Adventure Tours, we process personal data with principles of privacy and security under Turkish Law No. 6698 on the Protection of Personal Data.

Data Collected: Name, email address, phone number, booking information.
Purpose: Reservation management, customer communication, newsletter (with consent).
Retention Period: Legal period or up to 2 years after the service relationship ends.
Your Rights: You have the right to access, rectify, delete, and object to the processing of your data.

Contact: info@mobella.com`,
          },
          {
            id: "cookies",
            title: "Cookie Policy",
            content: `Our website uses cookies to improve user experience.

Essential Cookies: Required for site functionality; cannot be disabled.
Analytics Cookies: We measure visitor behaviour anonymously via Google Analytics 4.
Preference Cookies: Used to remember your language preference.

You can manage cookie preferences through your browser settings.`,
          },
          {
            id: "terms",
            title: "Terms of Use",
            content: `By using this website, you agree to the following terms:

1. All content on the site is the property of Mobella; unauthorised reproduction is prohibited.
2. Booking requests are not confirmed until verified by Mobella via phone or email.
3. Cancellation policy: Full refund if cancelled more than 7 days before the tour, 50% refund 3–7 days prior, no refund under 3 days.
4. Mobella reserves the right to modify tour programmes due to force majeure (weather, natural disasters, etc.).`,
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-10">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="font-serif text-xl text-[#0A4D68] mb-4">{s.title}</h2>
            <pre className="whitespace-pre-wrap text-gray-600 text-sm leading-relaxed font-sans">
              {s.content}
            </pre>
          </section>
        ))}
      </div>
    </div>
  );
}
