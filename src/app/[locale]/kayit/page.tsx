"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mountain, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function KayitPage() {
  const t = useTranslations("auth");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [kvkk, setKvkk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(t("password_short"));
      return;
    }
    if (password !== passwordConfirm) {
      setError(t("password_mismatch"));
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (authError) {
      setError(t("generic_error"));
      setLoading(false);
      return;
    }

    // Supabase returns empty identities when email is already registered
    if (data.user?.identities?.length === 0) {
      setError(t("email_in_use"));
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
              {t("register_success")}
            </h2>
            <p className="text-sm text-gray-500 mb-6">{t("email_confirm_note")}</p>
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
          {/* Logo */}
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
            {t("register_title")}
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            {t("register_subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                {t("full_name")}
              </Label>
              <Input
                type="text"
                required
                autoComplete="name"
                placeholder="Ad Soyad"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11"
              />
            </div>

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

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                {t("password")}
              </Label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="En az 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                {t("password_confirm")}
              </Label>
              <Input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Şifreyi tekrar gir"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="h-11"
              />
            </div>

            {/* KVKK */}
            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={kvkk}
                onChange={(e) => setKvkk(e.target.checked)}
                required
                className="mt-0.5 accent-[#0A4D68]"
              />
              <span className="text-xs text-gray-500">{t("kvkk")}</span>
            </label>

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
                t("register_btn")
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t("has_account")}{" "}
            <Link
              href="/giris"
              className="text-[#0A4D68] font-semibold hover:underline"
            >
              {t("login_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
