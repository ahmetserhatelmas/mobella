"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function SifremiUnuttumPage() {
  const t = useTranslations("auth");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent("/sifre-yenile")}`;

    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo }
    );

    if (authError) {
      setError(t("generic_error"));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A4D68]/5 via-white to-[#F5E6CA]/30 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-[#1F2937] mb-2">
              {t("reset_email_sent_title")}
            </h2>
            <p className="text-sm text-gray-500 mb-6">{t("reset_email_sent_note")}</p>
            <Link href="/giris">
              <Button className="bg-[#FF6B47] hover:bg-[#e55a38] text-white">
                {t("login_link")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A4D68]/5 via-white to-[#F5E6CA]/30 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="flex justify-center mb-8">
            <Link href="/">
              <Image
                src="/mobella-logo.png"
                alt="Mobella"
                width={130}
                height={52}
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          <h1 className="text-2xl font-serif font-semibold text-[#1F2937] text-center mb-1">
            {t("forgot_password_title")}
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            {t("forgot_password_subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                {t("email")}
              </Label>
              <Input
                type="email"
                required
                autoComplete="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#FF6B47] hover:bg-[#e55a38] text-white text-sm font-semibold"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t("send_reset_link")
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link
              href="/giris"
              className="text-[#0A4D68] font-semibold hover:underline"
            >
              {t("back_to_login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
