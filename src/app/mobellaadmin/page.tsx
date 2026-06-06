import { createClient } from "@/lib/supabase/server";
import { Calendar, CheckCircle, Clock, Package, Mail } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [bookingsRes, expRes, subRes] = await Promise.all([
    supabase.from("bookings").select("status"),
    supabase.from("experiences").select("id").eq("is_active", true),
    supabase.from("newsletter_subscribers").select("id"),
  ]);

  const bookingsData = (bookingsRes.data ?? []) as { status: string }[];
  const total = bookingsData.length;
  const pending = bookingsData.filter((b) => b.status === "pending").length;
  const confirmed = bookingsData.filter((b) => b.status === "confirmed").length;
  const expCount = expRes.data?.length ?? 0;
  const subCount = subRes.data?.length ?? 0;

  const stats = [
    {
      label: "Toplam Rezervasyon",
      value: total,
      icon: <Calendar className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-600",
      href: "/mobellaadmin/rezervasyonlar",
    },
    {
      label: "Bekleyen",
      value: pending,
      icon: <Clock className="w-5 h-5" />,
      color: "bg-amber-50 text-amber-600",
      href: "/mobellaadmin/rezervasyonlar",
    },
    {
      label: "Onaylanan",
      value: confirmed,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "bg-green-50 text-green-600",
      href: "/mobellaadmin/rezervasyonlar",
    },
    {
      label: "Aktif Deneyim",
      value: expCount,
      icon: <Package className="w-5 h-5" />,
      color: "bg-[#F5E6CA] text-[#0A4D68]",
      href: "/mobellaadmin/deneyimler",
    },
    {
      label: "Bülten Abonesi",
      value: subCount,
      icon: <Mail className="w-5 h-5" />,
      color: "bg-purple-50 text-purple-600",
      href: "/mobellaadmin/bulten",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Mobella yönetim paneline hoş geldiniz.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Hızlı Bağlantılar</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/mobellaadmin/rezervasyonlar" className="px-4 py-3 bg-[#0A4D68] text-white rounded-lg text-sm font-medium hover:bg-[#083d54] transition-colors text-center">
            Rezervasyonları Gör
          </Link>
          <Link href="/mobellaadmin/deneyimler/yeni" className="px-4 py-3 bg-[#F5E6CA] text-[#0A4D68] rounded-lg text-sm font-medium hover:bg-[#ecddb0] transition-colors text-center">
            Deneyim Ekle
          </Link>
        </div>
      </div>
    </div>
  );
}
