"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExperienceDatesEditor } from "@/components/admin/ExperienceDatesEditor";
import { Loader2, Upload, X, Plus, Trash2 } from "lucide-react";
import type { Experience, ExperienceDate } from "@/lib/supabase/types";

type ProgramDay = { day: string; items: string[] };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function linesToArray(text: string) {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

function arrayToLines(arr: string[] | null) {
  return (arr ?? []).join("\n");
}

function parseProgram(json: unknown): ProgramDay[] {
  if (!Array.isArray(json)) return [];
  return json.map((d) => ({
    day: String(d.day ?? ""),
    items: Array.isArray(d.items) ? d.items.map(String) : [],
  }));
}

function programToJson(days: ProgramDay[]) {
  return days.filter((d) => d.day.trim()).map((d) => ({
    day: d.day,
    items: d.items.filter(Boolean),
  }));
}

type FormState = {
  code: string;
  slug: string;
  name_tr: string;
  name_en: string;
  tagline_tr: string;
  tagline_en: string;
  description_tr: string;
  description_en: string;
  duration_days: string;
  duration_nights: string;
  min_group_size: string;
  max_group_size: string;
  difficulty: string;
  season_tr: string;
  season_en: string;
  base_price: string;
  theme_color: string;
  cover_image_url: string;
  gallery_urls: string;
  included_tr: string;
  included_en: string;
  not_included_tr: string;
  not_included_en: string;
  is_active: boolean;
  sort_order: string;
};

function experienceToForm(exp?: Experience): FormState {
  return {
    code: exp?.code ?? "",
    slug: exp?.slug ?? "",
    name_tr: exp?.name_tr ?? "",
    name_en: exp?.name_en ?? "",
    tagline_tr: exp?.tagline_tr ?? "",
    tagline_en: exp?.tagline_en ?? "",
    description_tr: exp?.description_tr ?? "",
    description_en: exp?.description_en ?? "",
    duration_days: String(exp?.duration_days ?? 1),
    duration_nights: String(exp?.duration_nights ?? 0),
    min_group_size: String(exp?.min_group_size ?? 1),
    max_group_size: String(exp?.max_group_size ?? ""),
    difficulty: exp?.difficulty ?? "easy",
    season_tr: exp?.season_tr ?? "",
    season_en: exp?.season_en ?? "",
    base_price: String(exp?.base_price ?? 0),
    theme_color: exp?.theme_color ?? "#0A4D68",
    cover_image_url: exp?.cover_image_url ?? "",
    gallery_urls: arrayToLines(exp?.gallery_urls ?? null),
    included_tr: arrayToLines(exp?.included_tr ?? null),
    included_en: arrayToLines(exp?.included_en ?? null),
    not_included_tr: arrayToLines(exp?.not_included_tr ?? null),
    not_included_en: arrayToLines(exp?.not_included_en ?? null),
    is_active: exp?.is_active ?? true,
    sort_order: String(exp?.sort_order ?? 0),
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-gray-600 mb-1">{label}</Label>
      {children}
    </div>
  );
}

function ImagePreview({
  src,
  alt,
  className,
  onRemove,
}: {
  src: string;
  alt: string;
  className?: string;
  onRemove?: () => void;
}) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden border border-gray-200 bg-gray-100 shrink-0 ${className ?? "w-40 h-28 rounded-lg"}`}>
      {!error && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
          onLoad={() => setError(false)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 px-2 text-center">
          Görsel yüklenemedi
        </div>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export function ExperienceForm({
  experience,
  dates = [],
}: {
  experience?: Experience;
  dates?: ExperienceDate[];
}) {
  const router = useRouter();
  const isNew = !experience;
  const [form, setForm] = useState<FormState>(() => experienceToForm(experience));
  const [programTr, setProgramTr] = useState<ProgramDay[]>(() => parseProgram(experience?.program_tr));
  const [programEn, setProgramEn] = useState<ProgramDay[]>(() => parseProgram(experience?.program_en));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof FormState, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const uploadFile = async (file: File, target: "cover" | "gallery") => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (target === "cover") {
        update("cover_image_url", data.url);
      } else {
        const current = linesToArray(form.gallery_urls);
        update("gallery_urls", [...current, data.url].join("\n"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  };

  const buildPayload = () => ({
    code: form.code,
    slug: form.slug || slugify(form.name_tr),
    name_tr: form.name_tr,
    name_en: form.name_en,
    tagline_tr: form.tagline_tr || null,
    tagline_en: form.tagline_en || null,
    description_tr: form.description_tr || null,
    description_en: form.description_en || null,
    duration_days: Number(form.duration_days),
    duration_nights: Number(form.duration_nights),
    min_group_size: Number(form.min_group_size),
    max_group_size: form.max_group_size ? Number(form.max_group_size) : null,
    difficulty: form.difficulty as "easy" | "medium" | "hard",
    season_tr: form.season_tr || null,
    season_en: form.season_en || null,
    base_price: Number(form.base_price),
    theme_color: form.theme_color,
    cover_image_url: form.cover_image_url || null,
    gallery_urls: linesToArray(form.gallery_urls),
    included_tr: linesToArray(form.included_tr),
    included_en: linesToArray(form.included_en),
    not_included_tr: linesToArray(form.not_included_tr),
    not_included_en: linesToArray(form.not_included_en),
    program_tr: programToJson(programTr),
    program_en: programToJson(programEn),
    is_active: form.is_active,
    sort_order: Number(form.sort_order),
  });

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = buildPayload();
      const res = await fetch(
        isNew ? "/api/experiences" : `/api/experiences/${experience!.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (isNew) {
        router.push(`/mobellaadmin/deneyimler/${data.id}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!experience || !confirm("Bu deneyimi silmek istediğinize emin misiniz?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/experiences/${experience.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/mobellaadmin/deneyimler");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silme başarısız.");
      setLoading(false);
    }
  };

  const addProgramDay = (lang: "tr" | "en") => {
    const setter = lang === "tr" ? setProgramTr : setProgramEn;
    setter((days) => [...days, { day: `Gün ${days.length + 1}`, items: [""] }]);
  };

  const updateProgramDay = (lang: "tr" | "en", idx: number, field: "day" | "items", value: string | string[]) => {
    const setter = lang === "tr" ? setProgramTr : setProgramEn;
    setter((days) => days.map((d, i) => (i === idx ? { ...d, [field]: value } : d)));
  };

  const removeProgramDay = (lang: "tr" | "en", idx: number) => {
    const setter = lang === "tr" ? setProgramTr : setProgramEn;
    setter((days) => days.filter((_, i) => i !== idx));
  };

  const galleryUrls = linesToArray(form.gallery_urls);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="genel">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="genel">Genel</TabsTrigger>
          <TabsTrigger value="gorseller">Görseller</TabsTrigger>
          <TabsTrigger value="icerik">İçerik</TabsTrigger>
          <TabsTrigger value="program">Program</TabsTrigger>
          {experience && <TabsTrigger value="tarihler">Tarihler</TabsTrigger>}
          <TabsTrigger value="yayin">Yayın</TabsTrigger>
        </TabsList>

        <TabsContent value="genel" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Kod">
              <Input value={form.code} onChange={(e) => update("code", e.target.value)} placeholder="MOB-CES-01" />
            </Field>
            <Field label="Slug (URL)">
              <Input
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder={slugify(form.name_tr) || "cesme-ruzgar"}
              />
            </Field>
            <Field label="İsim (TR)">
              <Input value={form.name_tr} onChange={(e) => update("name_tr", e.target.value)} />
            </Field>
            <Field label="İsim (EN)">
              <Input value={form.name_en} onChange={(e) => update("name_en", e.target.value)} />
            </Field>
            <Field label="Slogan (TR)">
              <Input value={form.tagline_tr} onChange={(e) => update("tagline_tr", e.target.value)} />
            </Field>
            <Field label="Slogan (EN)">
              <Input value={form.tagline_en} onChange={(e) => update("tagline_en", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Açıklama (TR)">
              <Textarea rows={4} value={form.description_tr} onChange={(e) => update("description_tr", e.target.value)} />
            </Field>
            <Field label="Açıklama (EN)">
              <Textarea rows={4} value={form.description_en} onChange={(e) => update("description_en", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Gün">
              <Input type="number" min="1" value={form.duration_days} onChange={(e) => update("duration_days", e.target.value)} />
            </Field>
            <Field label="Gece">
              <Input type="number" min="0" value={form.duration_nights} onChange={(e) => update("duration_nights", e.target.value)} />
            </Field>
            <Field label="Min. Grup">
              <Input type="number" min="1" value={form.min_group_size} onChange={(e) => update("min_group_size", e.target.value)} />
            </Field>
            <Field label="Max. Grup">
              <Input type="number" min="1" value={form.max_group_size} onChange={(e) => update("max_group_size", e.target.value)} />
            </Field>
            <Field label="Zorluk">
              <select value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="easy">Kolay</option>
                <option value="medium">Orta</option>
                <option value="hard">Zor</option>
              </select>
            </Field>
            <Field label="Sezon (TR)">
              <Input value={form.season_tr} onChange={(e) => update("season_tr", e.target.value)} placeholder="Mart–Kasım" />
            </Field>
            <Field label="Sezon (EN)">
              <Input value={form.season_en} onChange={(e) => update("season_en", e.target.value)} placeholder="March–November" />
            </Field>
            <Field label="Taban Fiyat (₺)">
              <Input type="number" min="0" value={form.base_price} onChange={(e) => update("base_price", e.target.value)} />
            </Field>
          </div>
        </TabsContent>

        <TabsContent value="gorseller" className="mt-4 space-y-4">
          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Kapak Fotoğrafı</Label>
            <div className="flex gap-4 items-start">
              {form.cover_image_url && (
                <ImagePreview
                  src={form.cover_image_url}
                  alt="Kapak"
                  onRemove={() => update("cover_image_url", "")}
                />
              )}
              <div className="flex-1 space-y-2">
                <Input value={form.cover_image_url} onChange={(e) => update("cover_image_url", e.target.value)} placeholder="URL veya dosya yükleyin" />
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "cover")} />
                <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => coverInputRef.current?.click()}>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4 mr-1" /> Dosya Yükle</>}
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Galeri Fotoğrafları</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {galleryUrls.map((url, i) => (
                <ImagePreview
                  key={`${url}-${i}`}
                  src={url}
                  alt={`Galeri ${i + 1}`}
                  className="w-24 h-20 rounded-lg"
                  onRemove={() => update("gallery_urls", galleryUrls.filter((_, j) => j !== i).join("\n"))}
                />
              ))}
            </div>
            <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "gallery")} />
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => galleryInputRef.current?.click()}>
              <Plus className="w-4 h-4 mr-1" /> Galeriye Ekle
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="icerik" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Dahil Olanlar (TR) — her satır bir madde">
              <Textarea rows={6} value={form.included_tr} onChange={(e) => update("included_tr", e.target.value)} />
            </Field>
            <Field label="Dahil Olanlar (EN)">
              <Textarea rows={6} value={form.included_en} onChange={(e) => update("included_en", e.target.value)} />
            </Field>
            <Field label="Dahil Olmayanlar (TR)">
              <Textarea rows={4} value={form.not_included_tr} onChange={(e) => update("not_included_tr", e.target.value)} />
            </Field>
            <Field label="Dahil Olmayanlar (EN)">
              <Textarea rows={4} value={form.not_included_en} onChange={(e) => update("not_included_en", e.target.value)} />
            </Field>
          </div>
        </TabsContent>

        <TabsContent value="program" className="mt-4 space-y-6">
          {(["tr", "en"] as const).map((lang) => {
            const days = lang === "tr" ? programTr : programEn;
            return (
              <div key={lang}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm text-gray-900">Program ({lang.toUpperCase()})</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => addProgramDay(lang)}>
                    <Plus className="w-4 h-4 mr-1" /> Gün Ekle
                  </Button>
                </div>
                <div className="space-y-3">
                  {days.map((day, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div className="flex gap-2">
                        <Input value={day.day} onChange={(e) => updateProgramDay(lang, idx, "day", e.target.value)} placeholder="Gün 1 — Cumartesi" className="flex-1" />
                        <button onClick={() => removeProgramDay(lang, idx)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <Textarea
                        rows={3}
                        value={day.items.join("\n")}
                        onChange={(e) => updateProgramDay(lang, idx, "items", linesToArray(e.target.value))}
                        placeholder="Her satır bir program maddesi"
                      />
                    </div>
                  ))}
                  {days.length === 0 && <p className="text-sm text-gray-400">Henüz program günü eklenmedi.</p>}
                </div>
              </div>
            );
          })}
        </TabsContent>

        {experience && (
          <TabsContent value="tarihler" className="mt-4">
            <ExperienceDatesEditor experienceId={experience.id} dates={dates} />
          </TabsContent>
        )}

        <TabsContent value="yayin" className="mt-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Sitede Görünürlük</p>
                <p className="text-sm text-gray-500">Pasif deneyimler sitede ve ana sayfada görünmez.</p>
              </div>
              <button
                type="button"
                onClick={() => update("is_active", !form.is_active)}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.is_active ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
            <Field label="Ana Sayfa Sırası (küçük numara önce görünür)">
              <Input type="number" min="0" value={form.sort_order} onChange={(e) => update("sort_order", e.target.value)} className="w-32" />
            </Field>
          </div>
        </TabsContent>
      </Tabs>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <Button onClick={handleSave} disabled={loading || uploading} className="bg-[#0A4D68] hover:bg-[#083d54] text-white">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isNew ? "Oluştur" : "Kaydet"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/mobellaadmin/deneyimler")}>İptal</Button>
        {experience && (
          <Button variant="outline" onClick={handleDelete} disabled={loading} className="ml-auto text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-1" /> Sil
          </Button>
        )}
      </div>
    </div>
  );
}
