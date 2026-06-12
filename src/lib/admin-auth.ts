import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "mobella-admin-auth";
const ADMIN_SESSION_SALT = "mobella-admin-v1";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

export function isAdminPasswordConfigured() {
  return getAdminPassword().length > 0;
}

export function createAdminSessionToken() {
  const password = getAdminPassword();
  if (!password) return null;

  return createHmac("sha256", password)
    .update(ADMIN_SESSION_SALT)
    .digest("hex");
}

export function verifyAdminPassword(password: string) {
  const expected = getAdminPassword();
  if (!expected) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

export function isAdminAuthenticated(request: Pick<NextRequest, "cookies">) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const expected = createAdminSessionToken();
  if (!token || !expected) return false;

  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}

export const ADMIN_API_PREFIXES = [
  "/api/experiences",
  "/api/dates",
  "/api/upload",
  "/api/bookings/",
];

export function isProtectedAdminApi(pathname: string) {
  return ADMIN_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix)
  );
}
