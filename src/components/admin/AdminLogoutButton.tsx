"use client";

import { LogOut } from "lucide-react";
import { adminLogout } from "@/app/mobellaadmin/giris/actions";

export function AdminLogoutButton() {
  return (
    <form action={adminLogout}>
      <button
        type="submit"
        className="mt-3 flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
        Çıkış Yap
      </button>
    </form>
  );
}
