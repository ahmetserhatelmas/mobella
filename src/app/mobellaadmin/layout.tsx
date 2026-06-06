import Link from "next/link";
import Image from "next/image";
import { Mountain, Calendar, Mail, MessageSquare, Package } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="antialiased bg-gray-50 min-h-screen flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-[#1F2937] text-white flex flex-col shrink-0">
            <div className="p-5 border-b border-white/10">
              <Link href="/mobellaadmin" className="flex items-center gap-2">
                <Image
                  src="/mobella-logo.png"
                  alt="Mobella"
                  width={90}
                  height={36}
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
                <p className="text-xs text-white/40 mt-1">Admin Panel</p>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {[
                { href: "/mobellaadmin", label: "Dashboard", icon: <Package className="w-4 h-4" /> },
                { href: "/mobellaadmin/rezervasyonlar", label: "Rezervasyonlar", icon: <Calendar className="w-4 h-4" /> },
                { href: "/mobellaadmin/deneyimler", label: "Deneyimler", icon: <Mountain className="w-4 h-4" /> },
                { href: "/mobellaadmin/mesajlar", label: "Mesajlar", icon: <MessageSquare className="w-4 h-4" /> },
                { href: "/mobellaadmin/bulten", label: "Bülten", icon: <Mail className="w-4 h-4" /> },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-white/10">
              <Link
                href="/tr"
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                ← Siteye Dön
              </Link>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
