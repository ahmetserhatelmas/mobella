"use client";

import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    // 1. Ege dalgası — açık deniz
    url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=85",
    alt: "Ege denizi dalgası",
    label: "Ege & Akdeniz",
    position: "center 50%",
  },
  {
    // 2. Tekne turu — turkuaz koyda tekneler (Seval Torun)
    url: "https://images.unsplash.com/photo-1758971139390-b6b9734a45c7?w=1920&q=85",
    alt: "Turkuaz koyda tekne turu",
    label: "Tekne Turu",
    position: "center 60%",
  },
  {
    // 3. Plaj voleybolu — sahilde maç
    url: "https://images.unsplash.com/photo-1521138054413-5a47d349b7af?w=1920&q=85",
    alt: "Sahilde plaj voleybolu",
    label: "Voleybol",
    position: "center 40%",
  },
  {
    // 3. Sörf — büyük dalga sörfçü
    url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1920&q=85",
    alt: "Sörf dalgası",
    label: "Sörf & Spor",
    position: "center 50%",
  },
  {
    // 4. Turkuaz sahil — Ege plajı
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85",
    alt: "Turkuaz Ege plajı",
    label: "Mavi Koylar",
    position: "center 65%",
  },
  {
    // 5. Likya Yolu — dağ yürüyüşü
    url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=85",
    alt: "Likya Yolu doğa yürüyüşü",
    label: "Doğa Yürüyüşleri",
    position: "center 60%",
  },
  {
    // 6. Orman & göl — İzmir doğa
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=85",
    alt: "Doğa ve orman",
    label: "Doğa Kaçışları",
    position: "center 50%",
  },
];

const DURATION = 6000; // ms per slide
const FADE_DURATION = 1200; // ms crossfade

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    const nextIdx = (current + 1) % SLIDES.length;
    setNext(nextIdx);
    setFading(true);
    setTimeout(() => {
      setCurrent(nextIdx);
      setNext(null);
      setFading(false);
    }, FADE_DURATION);
  }, [current]);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(advance, DURATION);
    return () => clearTimeout(timer);
  }, [advance, paused, current]);

  const goTo = (idx: number) => {
    if (idx === current || fading) return;
    setNext(idx);
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setNext(null);
      setFading(false);
    }, FADE_DURATION);
  };

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Current slide */}
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className="absolute inset-0 bg-cover hero-kenburns"
          style={{
            backgroundImage: `url('${slide.url}')`,
            backgroundPosition: slide.position,
            opacity: idx === current ? 1 : 0,
            transition: `opacity ${FADE_DURATION}ms ease-in-out`,
            zIndex: idx === current ? 1 : idx === next ? 2 : 0,
          }}
          aria-hidden={idx !== current}
        />
      ))}

      {/* Slide label — bottom left */}
      <div
        className="absolute bottom-24 left-8 sm:left-12"
        style={{ zIndex: 10 }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition-all duration-700"
          key={current}
        >
          {SLIDES[current].label}
        </span>
      </div>

      {/* Dot indicators */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 items-center"
        style={{ zIndex: 10 }}
      >
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Slayt ${idx + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: idx === current ? "28px" : "8px",
              height: "8px",
              background: idx === current ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}
