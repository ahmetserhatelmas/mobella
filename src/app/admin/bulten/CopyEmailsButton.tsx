"use client";

import { useState } from "react";

export function CopyEmailsButton({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(emails.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-[#0A4D68] hover:text-[#FF6B47] transition-colors font-medium"
    >
      {copied ? "Kopyalandı ✓" : "Tümünü Kopyala"}
    </button>
  );
}
