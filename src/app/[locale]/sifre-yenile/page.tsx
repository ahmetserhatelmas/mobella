"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function SifreYenilePage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    const { error: authError } = await supabase.auth.updateUser({ password });

    if (authError) {
      setError(t("reset_link_invalid"));
      setLoading(false);
      return;
    }

    router.push("/hesabim");
    router.refresh();
  };

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
            {t("reset_password_title")}
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            {t("reset_password_subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                t("reset_password_btn")
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
