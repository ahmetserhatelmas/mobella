"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

interface ContactFormProps {
  locale: string;
}

export function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations("contact");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(locale === "tr" ? "Bir hata oluştu." : "An error occurred.");
      }
    } catch {
      setError(locale === "tr" ? "Bir hata oluştu." : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <CheckCircle className="w-12 h-12 text-green-600" />
        <p className="font-semibold text-green-800">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        required
        placeholder={t("name")}
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
      />
      <Input
        type="email"
        required
        placeholder={t("email")}
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
      />
      <Input
        type="tel"
        placeholder={t("phone")}
        value={form.phone}
        onChange={(e) => update("phone", e.target.value)}
      />
      <Textarea
        required
        placeholder={t("message")}
        rows={5}
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0A4D68] hover:bg-[#083d54] text-white"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("send")}
      </Button>
    </form>
  );
}
