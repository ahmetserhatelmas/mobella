"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ExperienceRowActions({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`"${name}" deneyimini silmek istediğinize emin misiniz?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      else router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/mobellaadmin/deneyimler/${id}`}
        className="p-1.5 text-[#0A4D68] hover:bg-blue-50 rounded transition-colors"
        title="Düzenle"
      >
        <Pencil className="w-4 h-4" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
        title="Sil"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
