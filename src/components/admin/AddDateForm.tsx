"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";

interface Experience {
  id: string;
  name_tr: string;
  code: string;
}

export function AddDateForm({ experiences }: { experiences: Experience[] }) {
  const [form, setForm] = useState({
    experience_id: "",
    start_date: "",
    end_date: "",
    price_per_person: "",
    max_capacity: "12",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setForm({ experience_id: "", start_date: "", end_date: "", price_per_person: "", max_capacity: "12" });
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-xs text-gray-600 mb-1">Deneyim</Label>
        <select
          required
          value={form.experience_id}
          onChange={(e) => update("experience_id", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D68]"
        >
          <option value="">Seçin...</option>
          {experiences.map((exp) => (
            <option key={exp.id} value={exp.id}>
              {exp.code} — {exp.name_tr}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600 mb-1">Başlangıç</Label>
          <Input type="date" required value={form.start_date} onChange={(e) => update("start_date", e.target.value)} />
        </div>
        <div>
          <Label className="text-xs text-gray-600 mb-1">Bitiş</Label>
          <Input type="date" required value={form.end_date} onChange={(e) => update("end_date", e.target.value)} />
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600 mb-1">Kişi Başı Fiyat (₺)</Label>
        <Input
          type="number"
          required
          min="0"
          placeholder="4500"
          value={form.price_per_person}
          onChange={(e) => update("price_per_person", e.target.value)}
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600 mb-1">Maks. Kapasite</Label>
        <Input
          type="number"
          required
          min="1"
          max="20"
          value={form.max_capacity}
          onChange={(e) => update("max_capacity", e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full bg-[#0A4D68] hover:bg-[#083d54] text-white">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <><CheckCircle className="w-4 h-4 mr-1" /> Eklendi</> : "Tarih Ekle"}
      </Button>
    </form>
  );
}
