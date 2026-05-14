import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/shared/ContactForm";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "tr" ? "İletişim | Mobella" : "Contact | Mobella" };
}

export default async function IletisimPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905001234567";

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-[#0A4D68] pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-white text-center">
          <h1 className="font-serif text-4xl sm:text-5xl mb-3">{t("title")}</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-[#1F2937]">
              {locale === "tr" ? "Bize Ulaşın" : "Reach Us"}
            </h2>

            <div className="space-y-4">
              <a
                href={`mailto:info@mobella.com`}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#0A4D68] transition-colors group"
              >
                <div className="w-10 h-10 bg-[#F5E6CA] rounded-full flex items-center justify-center text-[#0A4D68] group-hover:bg-[#0A4D68] group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{t("email_label")}</p>
                  <p className="font-medium text-[#1F2937]">info@mobella.com</p>
                </div>
              </a>

              <a
                href="tel:+905001234567"
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#0A4D68] transition-colors group"
              >
                <div className="w-10 h-10 bg-[#F5E6CA] rounded-full flex items-center justify-center text-[#0A4D68] group-hover:bg-[#0A4D68] group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">
                    {locale === "tr" ? "Telefon" : "Phone"}
                  </p>
                  <p className="font-medium text-[#1F2937]">+90 500 123 45 67</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#25D366] transition-colors group"
              >
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">WhatsApp</p>
                  <p className="font-medium text-[#1F2937]">{t("whatsapp")}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-[#F5E6CA] rounded-full flex items-center justify-center text-[#0A4D68]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{t("address")}</p>
                  <p className="font-medium text-[#1F2937]">İzmir / Muğla, Türkiye</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="font-serif text-xl text-[#1F2937] mb-5">
              {locale === "tr" ? "Mesaj Gönder" : "Send a Message"}
            </h2>
            <ContactForm locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
