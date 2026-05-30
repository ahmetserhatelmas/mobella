"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Compass,
  LogOut,
  FileText,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { tr as trLocale, enUS } from "date-fns/locale";
import Image from "next/image";

interface BookingWithDetails {
  id: string;
  booking_ref: string;
  status: "pending" | "confirmed" | "cancelled";
  num_persons: number;
  total_price: number;
  special_requests: string | null;
  created_at: string;
  customer_name: string;
  customer_email: string;
  experience_dates: {
    start_date: string;
    end_date: string;
  } | null;
  experiences: {
    name_tr: string;
    name_en: string;
    slug: string;
    cover_image_url: string | null;
    code: string;
  } | null;
}

interface DashboardClientProps {
  bookings: BookingWithDetails[];
  userEmail: string;
  userName: string;
}

const STATUS_CONFIG = {
  pending: {
    label_tr: "Bekliyor",
    label_en: "Pending",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: AlertCircle,
  },
  confirmed: {
    label_tr: "Onaylandı",
    label_en: "Confirmed",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label_tr: "İptal Edildi",
    label_en: "Cancelled",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const COVER_FALLBACKS: Record<string, string> = {
  "cesme-ruzgar-raket":
    "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80",
  "izmir-doga":
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
  "mugla-doga": "/images/mugla-doga.png",
  "antalya-doga": "/images/antalya-doga.png",
  "hafta-sonu-likyasi":
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80",
  "buyuk-likya":
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
  "mavi-yesil-tekne":
    "https://images.unsplash.com/photo-1758971139390-b6b9734a45c7?w=400&q=80",
  "urla-gurme":
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
  "alacati-ruzgar-kampi":
    "https://images.unsplash.com/photo-1766495106469-ffddb3ab7fa8?w=400&q=80",
  "alanya-voleybol":
    "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80",
  "fethiye-babadag": "/images/fethiye-babadag.png",
  "kapadokya-ozel":
    "https://images.unsplash.com/photo-1765794144925-11508ad9ba21?w=400&q=80",
  "kas-deniz":
    "https://images.unsplash.com/photo-1517699418036-fb5d179fef0c?w=400&q=80",
};

type TabKey = "all" | "upcoming" | "pending" | "confirmed" | "cancelled";

export default function DashboardClient({
  bookings,
  userEmail,
  userName,
}: DashboardClientProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const dateLocale = locale === "tr" ? trLocale : enUS;

  const today = new Date().toISOString().split("T")[0];

  const isUpcoming = (b: BookingWithDetails) =>
    b.experience_dates &&
    b.experience_dates.start_date >= today &&
    b.status !== "cancelled";

  const filtered = useMemo(() => {
    switch (activeTab) {
      case "upcoming":
        return bookings.filter(isUpcoming);
      case "pending":
        return bookings.filter((b) => b.status === "pending");
      case "confirmed":
        return bookings.filter((b) => b.status === "confirmed");
      case "cancelled":
        return bookings.filter((b) => b.status === "cancelled");
      default:
        return bookings;
    }
  }, [bookings, activeTab]);

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(isUpcoming).length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  };

  const displayName =
    userName || userEmail.split("@")[0];

  const emptyKey: Record<TabKey, string> = {
    all: "empty_all",
    upcoming: "empty_upcoming",
    pending: "empty_pending",
    confirmed: "empty_confirmed",
    cancelled: "empty_cancelled",
  };

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: t("tab_all"), count: stats.total },
    { key: "upcoming", label: t("tab_upcoming"), count: stats.upcoming },
    { key: "pending", label: t("tab_pending"), count: stats.pending },
    { key: "confirmed", label: t("tab_confirmed"), count: stats.confirmed },
    { key: "cancelled", label: t("tab_cancelled"), count: bookings.filter((b) => b.status === "cancelled").length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0A4D68] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pt-24">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white/60 text-sm mb-1">{t("welcome")},</p>
              <h1 className="text-3xl font-serif font-semibold">
                {displayName}
              </h1>
              <p className="text-white/60 text-sm mt-1">{userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors mt-1 shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">
                {locale === "tr" ? "Çıkış Yap" : "Sign Out"}
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { label: t("stat_total"), value: stats.total, icon: FileText },
              { label: t("stat_upcoming"), value: stats.upcoming, icon: Calendar },
              { label: t("stat_pending"), value: stats.pending, icon: Clock },
              { label: t("stat_confirmed"), value: stats.confirmed, icon: TrendingUp },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
              >
                <stat.icon className="w-5 h-5 text-white/50 mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-[#0A4D68] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`text-xs rounded-full w-5 h-5 flex items-center justify-center ${
                    activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Booking list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Compass className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">{t(emptyKey[activeTab])}</p>
            <Link href="/deneyimler">
              <Button className="bg-[#FF6B47] hover:bg-[#e55a38] text-white">
                {t("book_now")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const exp = booking.experiences;
              const dates = booking.experience_dates;
              const name = exp
                ? locale === "tr"
                  ? exp.name_tr
                  : exp.name_en
                : "—";
              const cover =
                exp
                  ? COVER_FALLBACKS[exp.slug] ?? exp.cover_image_url ?? ""
                  : "";
              const statusCfg = STATUS_CONFIG[booking.status];
              const StatusIcon = statusCfg.icon;
              const upcoming = isUpcoming(booking);
              const isPast =
                dates && dates.start_date < today;

              const startDate = dates
                ? new Date(dates.start_date + "T12:00:00")
                : null;
              const endDate = dates
                ? new Date(dates.end_date + "T12:00:00")
                : null;

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    {cover && (
                      <div className="relative w-full sm:w-36 h-32 sm:h-auto shrink-0">
                        <Image
                          src={cover}
                          alt={name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 144px"
                        />
                        {(upcoming || isPast) && (
                          <div className="absolute top-2 left-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                upcoming
                                  ? "bg-[#0A4D68] text-white"
                                  : "bg-gray-700/60 text-white"
                              }`}
                            >
                              {upcoming ? t("upcoming_badge") : t("past_badge")}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-[#1F2937]">
                            {name}
                          </h3>
                          {exp && (
                            <span className="text-xs text-gray-400 font-mono">
                              {exp.code}
                            </span>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${statusCfg.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {locale === "tr"
                            ? statusCfg.label_tr
                            : statusCfg.label_en}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm mb-3">
                        {startDate && (
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>
                              {format(startDate, "d MMM yyyy", {
                                locale: dateLocale,
                              })}
                              {endDate &&
                                dates!.start_date !== dates!.end_date &&
                                ` – ${format(endDate, "d MMM", {
                                  locale: dateLocale,
                                })}`}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>
                            {booking.num_persons} {t("per_person")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600 font-semibold text-[#0A4D68]">
                          <span>
                            ₺{booking.total_price.toLocaleString("tr-TR")}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                        <span className="text-xs text-gray-400 font-mono">
                          {booking.booking_ref}
                        </span>
                        {exp && (
                          <Link
                            href={`/deneyimler/${exp.slug}` as Parameters<typeof Link>[0]["href"]}
                            className="text-xs text-[#0A4D68] font-medium hover:underline flex items-center gap-0.5"
                          >
                            {locale === "tr" ? "Deneyimi Gör" : "View Experience"}
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>

                      {booking.special_requests && (
                        <p className="text-xs text-gray-400 italic mt-2 border-t border-dashed border-gray-100 pt-2">
                          &ldquo;{booking.special_requests}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
