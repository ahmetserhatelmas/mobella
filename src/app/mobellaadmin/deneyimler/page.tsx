import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CheckCircle, XCircle, ExternalLink, Plus } from "lucide-react";
import { ExperienceRowActions } from "@/components/admin/ExperienceRowActions";
import type { Experience } from "@/lib/supabase/types";

export default async function AdminDeneyimlerPage() {
  const supabase = createAdminClient();
  const { data: rawExp } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order");
  const experiences = rawExp as Experience[] | null;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deneyimler</h1>
          <p className="text-gray-500 text-sm mt-1">
            {experiences?.length ?? 0} deneyim
          </p>
        </div>
        <Link
          href="/mobellaadmin/deneyimler/yeni"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0A4D68] text-white rounded-lg text-sm font-medium hover:bg-[#083d54] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Deneyim
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Sıra", "Kod", "İsim", "Süre", "Fiyat", "Durum", "Siteye Bak", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {experiences?.map((exp) => (
                <tr key={exp.id} className={`hover:bg-gray-50 ${!exp.is_active ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{exp.sort_order}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{exp.code}</td>
                  <td className="px-4 py-3">
                    <Link href={`/mobellaadmin/deneyimler/${exp.id}`} className="font-medium text-gray-900 hover:text-[#0A4D68]">
                      {exp.name_tr}
                    </Link>
                    <p className="text-gray-400 text-xs">{exp.name_en}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {exp.duration_days}g{exp.duration_nights > 0 ? ` / ${exp.duration_nights}g` : ""}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    ₺{Number(exp.base_price).toLocaleString("tr-TR")}
                  </td>
                  <td className="px-4 py-3">
                    {exp.is_active ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs">
                        <CheckCircle className="w-3.5 h-3.5" /> Aktif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-xs">
                        <XCircle className="w-3.5 h-3.5" /> Pasif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {exp.is_active && (
                      <Link
                        href={`/tr/deneyimler/${exp.slug}`}
                        target="_blank"
                        className="text-[#0A4D68] hover:text-[#FF6B47] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ExperienceRowActions id={exp.id} name={exp.name_tr} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
