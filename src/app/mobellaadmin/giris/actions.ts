"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  createAdminSessionToken,
  getAdminCookieOptions,
  isAdminPasswordConfigured,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export type AdminLoginState = {
  error?: string;
};

export async function adminLogin(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  if (!isAdminPasswordConfigured()) {
    return {
      error: "Admin şifresi yapılandırılmamış. Vercel'de ADMIN_PASSWORD tanımlayın.",
    };
  }

  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/mobellaadmin");

  if (!password) {
    return { error: "Şifre gerekli." };
  }

  if (!verifyAdminPassword(password)) {
    return { error: "Hatalı şifre." };
  }

  const token = createAdminSessionToken();
  if (!token) {
    return { error: "Oturum oluşturulamadı." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, getAdminCookieOptions());

  redirect(from.startsWith("/mobellaadmin") ? from : "/mobellaadmin");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", {
    ...getAdminCookieOptions(),
    maxAge: 0,
  });
  redirect("/mobellaadmin/giris");
}
