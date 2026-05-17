"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import pinkflashImg from "@/assets/images/brand/Pinkflash.jpg";
import axisYImg from "@/assets/images/brand/Axis-Y.jpg";
import klairsImg from "@/assets/images/brand/Klairs.jpg";
import laRochePosayImg from "@/assets/images/brand/La Roche-Posay.jpg";
import ceraveImg from "@/assets/images/brand/cerave.png";
import garnierImg from "@/assets/images/brand/Garnier.png";
import simpleImg from "@/assets/images/brand/simple.jpg";
import colorkeyImg from "@/assets/images/brand/Colorkey.jpg";
import lorealImg from "@/assets/images/brand/Loreal.jpg";
import judydollImg from "@/assets/images/brand/Judydoll.jpg";

const BRANDS = [
  { name: "Pinkflash", image: pinkflashImg },
  { name: "Axis-Y", image: axisYImg },
  { name: "Klairs", image: klairsImg },
  { name: "La Roche-Posay", image: laRochePosayImg },
  { name: "CeraVe", image: ceraveImg },
  { name: "Garnier", image: garnierImg },
  { name: "Simple", image: simpleImg },
  { name: "Colorkey", image: colorkeyImg },
  { name: "L'Oréal", image: lorealImg },
  { name: "Judydoll", image: judydollImg },
];

function HoloCard({ brand, index }: { brand: typeof BRANDS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 50,
    hovered: false,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    setStyle({
      rotateX: ((y - cy) / cy) * -18,
      rotateY: ((x - cx) / cx) * 18,
      glowX: (x / r.width) * 100,
      glowY: (y / r.height) * 100,
      hovered: true,
    });
  }

  function handleMouseLeave() {
    setStyle({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, hovered: false });
  }

  const floatDelay = index * 0.18;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer flex-shrink-0"
      style={{
        width: 160,
        height: 100,
        perspective: 600,
        animation: `brand-float 3.5s ease-in-out ${floatDelay}s infinite`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: style.hovered
            ? `rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg) scale(1.12) translateZ(10px)`
            : `rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)`,
          transition: style.hovered ? "transform 0.08s ease" : "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          borderRadius: 20,
          overflow: "hidden",
          background: "rgba(255,255,255,0.92)",
          boxShadow: style.hovered
            ? "0 24px 60px rgba(229,141,161,0.35), 0 8px 20px rgba(229,141,161,0.2), inset 0 1px 0 rgba(255,255,255,0.9)"
            : "0 8px 24px rgba(200,140,160,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
          border: "1px solid rgba(229,141,161,0.2)",
        }}
      >
        {/* Holographic shimmer overlay */}
        {style.hovered && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              background: `
                radial-gradient(circle at ${style.glowX}% ${style.glowY}%,
                  rgba(255,200,220,0.5) 0%,
                  rgba(229,141,161,0.2) 30%,
                  transparent 60%
                ),
                linear-gradient(
                  ${style.glowX * 2}deg,
                  rgba(255,180,210,0.15) 0%,
                  rgba(200,230,255,0.1) 50%,
                  rgba(255,200,180,0.15) 100%
                )
              `,
              pointerEvents: "none",
              zIndex: 10,
              mixBlendMode: "overlay",
            }}
          />
        )}

        {/* Specular highlight */}
        {style.hovered && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              background: `radial-gradient(ellipse at ${style.glowX}% ${style.glowY}%, rgba(255,255,255,0.6) 0%, transparent 50%)`,
              pointerEvents: "none",
              zIndex: 11,
            }}
          />
        )}

        {/* Logo */}
        <div style={{ position: "relative", width: "100%", height: "100%", padding: 16 }}>
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-contain"
            style={{ padding: 14 }}
            sizes="160px"
          />
        </div>

        {/* Brand name bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: style.hovered ? 28 : 0,
            background: "linear-gradient(to top, rgba(229,141,161,0.9), transparent)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 4,
            overflow: "hidden",
            transition: "height 0.25s ease",
            borderRadius: "0 0 20px 20px",
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color: "white", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {brand.name}
          </span>
        </div>
      </div>
    </div>
  );
}

export function BrandStrip() {
  return (
    <div className="w-full py-10">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-8">
        Brands hợp tác
      </p>

      {/* Row 1 — scroll right */}
      <div className="overflow-hidden mb-4">
        <div style={{ display: "flex", gap: 20, width: "max-content", animation: "brand-scroll-right 28s linear infinite" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.animationPlayState = "paused")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.animationPlayState = "running")}
        >
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <HoloCard key={`r1-${i}`} brand={brand} index={i % BRANDS.length} />
          ))}
        </div>
      </div>

      {/* Row 2 — scroll left (reverse) */}
      <div className="overflow-hidden">
        <div style={{ display: "flex", gap: 20, width: "max-content", animation: "brand-scroll-left 24s linear infinite" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.animationPlayState = "paused")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.animationPlayState = "running")}
        >
          {[...[...BRANDS].reverse(), ...[...BRANDS].reverse()].map((brand, i) => (
            <HoloCard key={`r2-${i}`} brand={brand} index={i % BRANDS.length} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes brand-scroll-right {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes brand-scroll-left {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @keyframes brand-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
