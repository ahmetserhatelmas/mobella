import {
  createAdminSessionToken,
  getAdminCookieOptions,
  isAdminPasswordConfigured,
  verifyAdminPassword,
  ADMIN_COOKIE,
} from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { error: "Admin şifresi yapılandırılmamış." },
      { status: 500 }
    );
  }

  const { password } = await req.json();
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Şifre gerekli." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Hatalı şifre." }, { status: 401 });
  }

  const token = createAdminSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Oturum oluşturulamadı." }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, token, getAdminCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    ...getAdminCookieOptions(),
    maxAge: 0,
  });
  return response;
}
