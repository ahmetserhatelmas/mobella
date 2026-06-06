import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type ContactMessage = { id: string; name: string; email: string; phone: string | null; message: string; created_at: string };

export default async function AdminMesajlarPage() {
  const supabase = await createClient();
  const { data: rawMsgs } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  const messages = rawMsgs as ContactMessage[] | null;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
        <p className="text-gray-500 text-sm mt-1">{messages?.length ?? 0} mesaj</p>
      </div>

      <div className="space-y-4">
        {messages?.map((m) => (
          <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-semibold text-gray-900">{m.name}</p>
                <div className="flex gap-3 text-sm text-gray-400 mt-0.5">
                  <a href={`mailto:${m.email}`} className="hover:text-[#0A4D68] transition-colors">{m.email}</a>
                  {m.phone && <span>{m.phone}</span>}
                </div>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {format(new Date(m.created_at), "d MMM yyyy HH:mm", { locale: tr })}
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-lg p-3">{m.message}</p>
          </div>
        ))}
        {(!messages || messages.length === 0) && (
          <div className="text-center py-12 text-gray-400">Henüz mesaj yok.</div>
        )}
      </div>
    </div>
  );
}
