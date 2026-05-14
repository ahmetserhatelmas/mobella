"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, Calendar, Users } from "lucide-react";
import type { ExperienceDate } from "@/lib/supabase/types";
import { format } from "date-fns";
import { tr, enUS } from "date-fns/locale";

interface BookingFormProps {
  experienceId: string;
  dates: ExperienceDate[];
  locale: string;
}

export function BookingForm({ experienceId, dates, locale }: BookingFormProps) {
  const t = useTranslations("experience");
  const [selectedDateId, setSelectedDateId] = useState<string>("");
  const [persons, setPersons] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const selectedDate = dates.find((d) => d.id === selectedDateId);
  const total = selectedDate ? selectedDate.price_per_person * persons : 0;
  const dateLocale = locale === "tr" ? tr : enUS;

  const availableDates = dates.filter(
    (d) => d.is_active && d.booked_count < d.max_capacity
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateId) {
      setError(locale === "tr" ? "Lütfen bir tarih seçin." : "Please select a date.");
      return;
    }
    if (!kvkk) {
      setError(locale === "tr" ? "KVKK onayı gereklidir." : "Privacy consent is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience_id: experienceId,
          experience_date_id: selectedDateId,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          num_persons: persons,
          special_requests: note,
          total_price: total,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || (locale === "tr" ? "Bir hata oluştu." : "An error occurred."));
      }
    } catch {
      setError(locale === "tr" ? "Bir hata oluştu." : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="font-semibold text-green-800 text-lg mb-2">
          {locale === "tr" ? "Talebiniz Alındı!" : "Request Received!"}
        </h3>
        <p className="text-green-700 text-sm">{t("reserve_success")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
      <h3 className="font-serif text-xl text-[#1F2937] mb-5 font-semibold">
        {t("booking_title")}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {t("select_date")}
          </Label>
          {availableDates.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              {locale === "tr" ? "Yakında yeni tarihler." : "New dates coming soon."}
            </p>
          ) : (
            <div className="space-y-2">
              {availableDates.map((d) => {
                const start = new Date(d.start_date);
                const end = new Date(d.end_date);
                const spots = d.max_capacity - d.booked_count;
                return (
                  <label
                    key={d.id}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedDateId === d.id
                        ? "border-[#0A4D68] bg-[#0A4D68]/5"
                        : "border-gray-200 hover:border-[#0A4D68]/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="date"
                        value={d.id}
                        checked={selectedDateId === d.id}
                        onChange={() => setSelectedDateId(d.id)}
                        className="accent-[#0A4D68]"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#1F2937]">
                          {format(start, "d MMMM", { locale: dateLocale })}
                          {d.start_date !== d.end_date &&
                            ` – ${format(end, "d MMMM", { locale: dateLocale })}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          {spots} {t("spots_left")}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#0A4D68] text-sm">
                      ₺{d.price_per_person.toLocaleString("tr-TR")}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Persons */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Users className="w-4 h-4" />
            {t("persons")}
          </Label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPersons((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#0A4D68] hover:text-[#0A4D68] transition-colors font-bold"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold text-[#1F2937]">
              {persons}
            </span>
            <button
              type="button"
              onClick={() =>
                setPersons((p) =>
                  Math.min(p + 1, selectedDate?.max_capacity ?? 12)
                )
              }
              className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#0A4D68] hover:text-[#0A4D68] transition-colors font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Total */}
        {selectedDate && (
          <div className="bg-[#F5E6CA] rounded-xl p-4 flex justify-between items-center">
            <span className="text-sm font-medium text-[#1F2937]">{t("total")}</span>
            <span className="text-xl font-bold text-[#0A4D68]">
              ₺{total.toLocaleString("tr-TR")}
            </span>
          </div>
        )}

        {/* Customer info */}
        <div className="space-y-3">
          <Input
            required
            placeholder={t("reserve_form_name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            required
            placeholder={t("reserve_form_email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="tel"
            required
            placeholder={t("reserve_form_phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Textarea
            placeholder={t("reserve_form_note")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />
        </div>

        {/* KVKK */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={kvkk}
            onChange={(e) => setKvkk(e.target.checked)}
            className="mt-0.5 accent-[#0A4D68]"
          />
          <span className="text-xs text-gray-500">{t("reserve_kvkk")}</span>
        </label>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <Button
          type="submit"
          disabled={loading || availableDates.length === 0}
          className="w-full bg-[#FF6B47] hover:bg-[#e55a38] text-white"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t("reserve_form_submit")
          )}
        </Button>
      </form>
    </div>
  );
}
