"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/mobellaadmin/giris");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-3 flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors"
    >
      <LogOut className="w-3.5 h-3.5" />
      Çıkış Yap
    </button>
  );
}
