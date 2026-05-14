"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905001234567";

  return (
    <a
      href={`https://wa.me/${number}?text=Merhaba, Mobella turları hakkında bilgi almak istiyorum.`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="WhatsApp ile yazın"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
    </a>
  );
}
