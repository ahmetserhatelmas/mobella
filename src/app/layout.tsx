import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Mobella Experience Travels", template: "%s | Mobella" },
  description: "İzmir merkezli Ege ve Akdeniz deneyim turları.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning data-scroll-behavior="smooth" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
