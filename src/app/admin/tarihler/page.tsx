import { createClient } from "@/lib/supabase/server";
import { AddDateForm } from "@/components/admin/AddDateForm";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type DateWithExp = {
  id: string; start_date: string; end_date: string;
  max_capacity: number; booked_count: number; price_per_person: number; is_active: boolean;
  experiences: { name_tr: string; code: string } | null;
};
type SimpleExperience = { id: string; name_tr: string; code: string };

export default async function AdminTarihlerPage() {
  const supabase = await createClient();

  const [rawExpRes, rawDatesRes] = await Promise.all([
    supabase.from("experiences").select("id, name_tr, code").eq("is_active", true).order("sort_order"),
    supabase.from("experience_dates").select("*, experiences(name_tr, code)").order("start_date"),
  ]);
  const experiences = rawExpRes.data as SimpleExperience[] | null;
  const dates = rawDatesRes.data as DateWithExp[] | null;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tarihler</h1>
        <p className="text-gray-500 text-sm mt-1">Tur takvimini yönetin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add date form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Yeni Tarih Ekle</h2>
            <AddDateForm experiences={experiences ?? []} />
          </div>
        </div>

        {/* Dates table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Deneyim", "Başlangıç", "Bitiş", "Fiyat", "Kapasite", "Dolu"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dates?.map((d) => {
                    const exp = d.experiences;
                    return (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 text-xs">{exp?.name_tr}</p>
                          <p className="text-gray-400 text-xs">{exp?.code}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {format(new Date(d.start_date), "d MMM yy", { locale: tr })}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {format(new Date(d.end_date), "d MMM yy", { locale: tr })}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          ₺{Number(d.price_per_person).toLocaleString("tr-TR")}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{d.max_capacity}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${d.booked_count >= d.max_capacity ? "text-red-600" : "text-green-600"}`}>
                            {d.booked_count}/{d.max_capacity}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {(!dates || dates.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-400">Henüz tarih eklenmedi.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
