import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // suppress unused var — locale used for alternates
  void (await getTranslations({ locale, namespace: "nav" }));
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: { tr: "/tr", en: "/en" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "tr" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <>
      {/* Set lang attribute on the shared <html> via a script-free trick — next-intl recommended */}
      <NextIntlClientProvider messages={messages}>
        <Navbar locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
        <WhatsAppButton />
      </NextIntlClientProvider>
    </>
  );
}
