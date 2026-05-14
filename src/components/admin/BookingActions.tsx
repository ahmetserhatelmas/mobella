"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingActionsProps {
  id: string;
  currentStatus: "pending" | "confirmed" | "cancelled";
}

export function BookingActions({ id, currentStatus }: BookingActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const update = async (status: string) => {
    setLoading(true);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex gap-1.5">
      {currentStatus === "pending" && (
        <>
          <button
            onClick={() => update("confirmed")}
            disabled={loading}
            className="px-2.5 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 disabled:opacity-50 transition-colors"
          >
            Onayla
          </button>
          <button
            onClick={() => update("cancelled")}
            disabled={loading}
            className="px-2.5 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 disabled:opacity-50 transition-colors"
          >
            İptal
          </button>
        </>
      )}
      {currentStatus === "confirmed" && (
        <button
          onClick={() => update("cancelled")}
          disabled={loading}
          className="px-2.5 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 disabled:opacity-50 transition-colors"
        >
          İptal
        </button>
      )}
      {currentStatus === "cancelled" && (
        <span className="text-xs text-gray-400">—</span>
      )}
    </div>
  );
}
