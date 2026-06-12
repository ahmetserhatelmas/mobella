import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CopyEmailsButton } from "./CopyEmailsButton";

type Subscriber = { id: string; email: string; kvkk_consent: boolean; subscribed_at: string };

export default async function AdminBultenPage() {
  const supabase = await createClient();
  const { data: rawSubs } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });
  const subscribers = rawSubs as Subscriber[] | null;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bülten Aboneleri</h1>
        <p className="text-gray-500 text-sm mt-1">{subscribers?.length ?? 0} abone</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-600">E-posta Listesi</p>
          <CopyEmailsButton emails={(subscribers ?? []).map((s) => s.email)} />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">E-posta</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">KVKK</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscribers?.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{s.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${s.kvkk_consent ? "text-green-600" : "text-red-500"}`}>
                    {s.kvkk_consent ? "Onaylı" : "Onaysız"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {format(new Date(s.subscribed_at), "d MMM yyyy", { locale: tr })}
                </td>
              </tr>
            ))}
            {(!subscribers || subscribers.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-gray-400">Henüz abone yok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
