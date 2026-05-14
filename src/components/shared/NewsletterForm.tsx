"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

export function NewsletterForm() {
  const t = useTranslations("home");
  const [email, setEmail] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kvkk) {
      setError("KVKK onayı gereklidir.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, kvkk_consent: kvkk }),
      });
      if (res.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        const data = await res.json();
        setError(data.error || "Bir hata oluştu.");
      }
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center gap-3 text-[#0A4D68]">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <p className="font-medium">{t("newsletter_success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletter_placeholder")}
          className="bg-white border-[#0A4D68]/20 focus:border-[#0A4D68]"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#0A4D68] hover:bg-[#083d54] text-white whitespace-nowrap"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t("newsletter_cta")
          )}
        </Button>
      </div>
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={kvkk}
          onChange={(e) => setKvkk(e.target.checked)}
          className="mt-0.5 accent-[#0A4D68]"
        />
        <span className="text-xs text-gray-500">{t("newsletter_kvkk")}</span>
      </label>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </form>
  );
}
