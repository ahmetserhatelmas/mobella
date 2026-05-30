import { Suspense } from "react";
import type { Metadata } from "next";
import GirisClient from "./GirisClient";

export const metadata: Metadata = {
  title: "Giriş Yap — Mobella",
};

export default function GirisPage() {
  return (
    <Suspense>
      <GirisClient />
    </Suspense>
  );
}
