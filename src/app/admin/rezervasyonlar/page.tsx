import { createClient } from "@/lib/supabase/server";
import { BookingActions } from "@/components/admin/BookingActions";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type BookingWithRelations = {
  id: string; booking_ref: string; customer_name: string; customer_email: string;
  num_persons: number; status: string; total_price: number;
  experience_dates: { start_date: string; end_date: string } | null;
  experiences: { name_tr: string; code: string } | null;
};

export default async function ReservasyonlarPage() {
  const supabase = await createClient();

  const { data: rawBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      experience_dates(start_date, end_date),
      experiences(name_tr, code)
    `)
    .order("created_at", { ascending: false });
  const bookings = rawBookings as BookingWithRelations[] | null;

  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    pending: "Bekliyor",
    confirmed: "Onaylandı",
    cancelled: "İptal",
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlar</h1>
        <p className="text-gray-500 text-sm mt-1">
          Toplam {bookings?.length ?? 0} rezervasyon
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Ref", "Müşteri", "Deneyim", "Tarih", "Kişi", "Toplam", "Durum", "İşlem"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings?.map((b) => {
                const expDate = b.experience_dates;
                const exp = b.experiences;
                return (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{b.booking_ref}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{b.customer_name}</p>
                      <p className="text-gray-400 text-xs">{b.customer_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{exp?.name_tr}</p>
                      <p className="text-gray-400 text-xs">{exp?.code}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {expDate
                        ? format(new Date(expDate.start_date), "d MMM yyyy", { locale: tr })
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{b.num_persons}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ₺{Number(b.total_price).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status as keyof typeof statusColors]}`}
                      >
                        {statusLabels[b.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <BookingActions
                        id={b.id}
                        currentStatus={b.status as "pending" | "confirmed" | "cancelled"}
                      />
                    </td>
                  </tr>
                );
              })}
              {(!bookings || bookings.length === 0) && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    Henüz rezervasyon yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
