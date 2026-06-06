"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Pencil, X, Check } from "lucide-react";
import type { ExperienceDate } from "@/lib/supabase/types";

type DateForm = {
  start_date: string;
  end_date: string;
  price_per_person: string;
  max_capacity: string;
};

const emptyForm: DateForm = {
  start_date: "",
  end_date: "",
  price_per_person: "",
  max_capacity: "12",
};

export function ExperienceDatesEditor({
  experienceId,
  dates,
}: {
  experienceId: string;
  dates: ExperienceDate[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<DateForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<DateForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addDate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience_id: experienceId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm(emptyForm);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (d: ExperienceDate) => {
    setEditingId(d.id);
    setEditForm({
      start_date: d.start_date,
      end_date: d.end_date,
      price_per_person: String(d.price_per_person),
      max_capacity: String(d.max_capacity),
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/dates/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: editForm.start_date,
          end_date: editForm.end_date,
          price_per_person: Number(editForm.price_per_person),
          max_capacity: Number(editForm.max_capacity),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const deleteDate = async (id: string) => {
    if (!confirm("Bu tarihi silmek istediğinize emin misiniz?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/dates/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (d: ExperienceDate) => {
    setLoading(true);
    try {
      await fetch(`/api/dates/${d.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !d.is_active }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={addDate} className="bg-gray-50 rounded-xl p-4 space-y-3">
        <h3 className="font-medium text-gray-900 text-sm">Yeni Tarih Ekle</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs">Başlangıç</Label>
            <Input type="date" required value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Bitiş</Label>
            <Input type="date" required value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Fiyat (₺)</Label>
            <Input type="number" required min="0" value={form.price_per_person} onChange={(e) => setForm((f) => ({ ...f, price_per_person: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Kapasite</Label>
            <Input type="number" required min="1" value={form.max_capacity} onChange={(e) => setForm((f) => ({ ...f, max_capacity: e.target.value }))} />
          </div>
        </div>
        <Button type="submit" disabled={loading} size="sm" className="bg-[#0A4D68] hover:bg-[#083d54] text-white">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-1" /> Tarih Ekle</>}
        </Button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Başlangıç", "Bitiş", "Fiyat", "Kapasite", "Dolu", "Durum", ""].map((h) => (
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {dates.map((d) => (
              <tr key={d.id} className={!d.is_active ? "opacity-50" : ""}>
                {editingId === d.id ? (
                  <>
                    <td className="px-3 py-2"><Input type="date" value={editForm.start_date} onChange={(e) => setEditForm((f) => ({ ...f, start_date: e.target.value }))} className="h-8 text-xs" /></td>
                    <td className="px-3 py-2"><Input type="date" value={editForm.end_date} onChange={(e) => setEditForm((f) => ({ ...f, end_date: e.target.value }))} className="h-8 text-xs" /></td>
                    <td className="px-3 py-2"><Input type="number" value={editForm.price_per_person} onChange={(e) => setEditForm((f) => ({ ...f, price_per_person: e.target.value }))} className="h-8 text-xs w-20" /></td>
                    <td className="px-3 py-2"><Input type="number" value={editForm.max_capacity} onChange={(e) => setEditForm((f) => ({ ...f, max_capacity: e.target.value }))} className="h-8 text-xs w-16" /></td>
                    <td colSpan={3} className="px-3 py-2">
                      <div className="flex gap-1">
                        <button onClick={saveEdit} disabled={loading} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-3 py-2 text-gray-700">{format(new Date(d.start_date), "d MMM yy", { locale: tr })}</td>
                    <td className="px-3 py-2 text-gray-700">{format(new Date(d.end_date), "d MMM yy", { locale: tr })}</td>
                    <td className="px-3 py-2 font-medium">₺{Number(d.price_per_person).toLocaleString("tr-TR")}</td>
                    <td className="px-3 py-2">{d.max_capacity}</td>
                    <td className="px-3 py-2">
                      <span className={d.booked_count >= d.max_capacity ? "text-red-600" : "text-green-600"}>
                        {d.booked_count}/{d.max_capacity}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button onClick={() => toggleActive(d)} className={`text-xs px-2 py-0.5 rounded-full ${d.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {d.is_active ? "Aktif" : "Pasif"}
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(d)} className="p-1.5 text-[#0A4D68] hover:bg-blue-50 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteDate(d.id)} disabled={loading} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {dates.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Henüz tarih eklenmedi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
