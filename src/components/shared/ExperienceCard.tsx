"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Clock, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Experience } from "@/lib/supabase/types";

const SLUG_FALLBACKS: Record<string, string> = {
  "cesme-ruzgar-raket":
    "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80",
  "izmir-doga":
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  "hafta-sonu-likyasi":
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  "mavi-yesil-tekne":
    "https://images.unsplash.com/photo-1758971139390-b6b9734a45c7?w=800&q=80",
};

const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";

interface ExperienceCardProps {
  experience: Experience;
  locale: string;
  featured?: boolean;
}

export function ExperienceCard({
  experience,
  locale,
  featured = false,
}: ExperienceCardProps) {
  const fallback =
    SLUG_FALLBACKS[experience.slug] ?? DEFAULT_FALLBACK;
  const [imgSrc, setImgSrc] = useState(
    experience.cover_image_url || fallback
  );

  const name = locale === "tr" ? experience.name_tr : experience.name_en;
  const tagline = locale === "tr" ? experience.tagline_tr : experience.tagline_en;
  const season = locale === "tr" ? experience.season_tr : experience.season_en;
  const label = locale === "tr" ? "itibaren" : "from";

  const durationLabel =
    locale === "tr"
      ? `${experience.duration_days} gün${experience.duration_nights > 0 ? ` / ${experience.duration_nights} gece` : ""}`
      : `${experience.duration_days} day${experience.duration_days > 1 ? "s" : ""}${experience.duration_nights > 0 ? ` / ${experience.duration_nights} night${experience.duration_nights > 1 ? "s" : ""}` : ""}`;

  const difficultyLabel = {
    easy: locale === "tr" ? "Kolay" : "Easy",
    medium: locale === "tr" ? "Orta" : "Moderate",
    hard: locale === "tr" ? "Zor" : "Hard",
  }[experience.difficulty ?? "easy"];

  const difficultyColor = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-amber-100 text-amber-800",
    hard: "bg-red-100 text-red-800",
  }[experience.difficulty ?? "easy"];

  return (
    <Link href={`/deneyimler/${experience.slug}` as Parameters<typeof Link>[0]["href"]}>
      <div
        className={cn(
          "experience-card group rounded-2xl overflow-hidden bg-white shadow-md cursor-pointer border border-gray-100",
          featured && "ring-2 ring-[#FF6B47] ring-offset-2"
        )}
      >
        {/* Cover image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            onError={() => setImgSrc(fallback)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Price badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-white/95 backdrop-blur-sm text-[#0A4D68] font-bold text-sm px-3 py-1 rounded-full shadow">
              ₺{experience.base_price.toLocaleString("tr-TR")}
              <span className="font-normal text-xs text-gray-500 ml-1">{label}</span>
            </span>
          </div>

          {/* Season */}
          {season && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                {season}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-serif text-lg font-semibold text-[#1F2937] leading-tight line-clamp-2">
              {name}
            </h3>
            {experience.difficulty && (
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap",
                  difficultyColor
                )}
              >
                {difficultyLabel}
              </span>
            )}
          </div>

          {tagline && (
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{tagline}</p>
          )}

          <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {durationLabel}
            </span>
            {experience.max_group_size && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                max {experience.max_group_size}
              </span>
            )}
          </div>

          <div className="flex items-center text-[#FF6B47] font-medium text-sm group-hover:gap-2 gap-1 transition-all">
            {locale === "tr" ? "İncele" : "Explore"}
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
