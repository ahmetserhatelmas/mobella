"use client";

import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { adminLogin } from "./actions";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/mobellaadmin";
  const [state, formAction, pending] = useActionState(adminLogin, {});
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A4D68]/5 via-white to-[#F5E6CA]/30 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="flex justify-center mb-8">
            <Link href="/">
              <Image
                src="/mobella-logo.png"
                alt="Mobella"
                width={506}
                height={363}
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          <h1 className="text-2xl font-serif font-semibold text-[#1F2937] text-center mb-1">
            Admin Girişi
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Yönetim paneline erişmek için şifrenizi girin.
          </p>

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="from" value={from} />

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Şifre</Label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  className="pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {state.error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {state.error}
              </p>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full bg-[#0A4D68] hover:bg-[#083d54] text-white"
            >
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Giriş Yap"}
            </Button>
          </form>

          <p className="text-center mt-6">
            <Link href="/" className="text-sm text-[#0A4D68] hover:underline">
              ← Siteye dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
