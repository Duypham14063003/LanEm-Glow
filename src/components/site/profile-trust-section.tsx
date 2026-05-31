"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  ShieldCheck,
  Star,
  Heart,
  Users,
  ThumbsUp,
  PackageCheck,
  BadgeCheck,
} from "lucide-react";

import profileTiktok from "@/assets/images/me/profile_tiktok.png";
import anh1 from "@/assets/images/me/anh1.jpg";
import anh2 from "@/assets/images/me/anh2.jpg";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "4,395", label: "Followers", icon: Users, color: "#e58da1" },
  { value: "359.9K", label: "Lượt thích", icon: Heart, color: "#d86c87" },
  // { value: "100%", label: "Chính hãng", icon: ShieldCheck, color: "#2e9b6f" },
  { value: "10k+", label: "Đơn đã bán", icon: PackageCheck, color: "#7a646d" },
  { value: "200+", label: "Đơn đã pass", icon: PackageCheck, color: "#2e9b6f" },
];

const TRUST_POINTS = [
  {
    icon: BadgeCheck,
    text: "Content creator beauty được brand gửi PR trực tiếp",
  },
  { icon: Star, text: "Sản phẩm new/seal hoặc chỉ swatch nhẹ 1-2 lần" },
  { icon: ThumbsUp, text: "Giá mềm hơn 50%, cộng quà" },
  { icon: ShieldCheck, text: "Quay unboxing + check hàng trước khi gửi" },
];

function AnimatedStat({
  stat,
  delay,
}: {
  stat: (typeof STATS)[0];
  index: number;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Icon = stat.icon;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
      className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-sm"
    >
      <Icon size={20} style={{ color: stat.color }} strokeWidth={1.8} />
      <p className="font-heading text-2xl font-bold text-[var(--color-foreground)]">
        {stat.value}
      </p>
      <p className="text-xs text-[var(--color-muted)] font-medium tracking-wide">
        {stat.label}
      </p>
    </div>
  );
}

function TiltCard({
  children,
  className = "",
  href = "",
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
    gx: 50,
    gy: 50,
    hovered: false,
  });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    setTilt({
      x: ((y - r.height / 2) / r.height) * -14,
      y: ((x - r.width / 2) / r.width) * 14,
      gx: (x / r.width) * 100,
      gy: (y / r.height) * 100,
      hovered: true,
    });
  }

  function onLeave() {
    setTilt({ x: 0, y: 0, gx: 50, gy: 50, hovered: false });
  }

  return (
    <div
      onClick={() => href && window.open(href, "_blank")}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.hovered ? 1.02 : 1})`,
        transition: tilt.hovered
          ? "transform 0.08s ease"
          : "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
        willChange: "transform",
        cursor: href ? "pointer" : "default",
      }}
    >
      {children}
      {tilt.hovered && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-20"
          style={{
            background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.18) 0%, transparent 55%)`,
          }}
        />
      )}
    </div>
  );
}

export function ProfileTrustSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#fff5f7] via-white to-[#fce8ee] border border-[var(--color-border)] shadow-sm p-6 sm:p-10"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[var(--color-accent-soft)] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#fce8ee] opacity-60 blur-2xl" />

      {/* Header */}
      <div className="text-center mb-2 relative z-10">
        <h2 className="font-heading text-4xl sm:text-5xl text-[var(--color-foreground)] font-medium">
          Hello, mình là{" "}
          <span className="text-[var(--color-accent)]">Lan Anh</span> 🌸
        </h2>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.1fr_1fr] gap-6 lg:gap-8 items-center relative z-10">
        {/* Left: Profile photo with TikTok badge */}
        <TiltCard className="relative mx-auto w-full max-w-[280px] lg:max-w-none aspect-[3/4] rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(229,141,161,0.25)] border-4 border-white">
          <Image src={anh1} alt="Lan Anh" fill className="object-cover" />
          {/* Facebook overlay badge */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shrink-0">
                <Image src={anh2} alt="avatar" fill className="object-cover" />
              </div>
              <div>
                <p className="text-white text-xs font-bold leading-tight">
                  Lan Anh làm con gái
                </p>
                <a
                  href="https://www.facebook.com/lannnnanhhhh"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#fe2c55] text-[11px] font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  {/* Facebook icon */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3 h-3"
                  >
                    <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
                  </svg>
                  @lananh113388
                </a>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Center: Stats + story */}
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((stat, i) => (
              <AnimatedStat
                key={stat.label}
                stat={stat}
                index={i}
                delay={i * 0.1}
              />
            ))}
          </div>

          {/* Story */}
          <div className="bg-white/80 rounded-2xl p-5 border border-white shadow-sm space-y-3">
            <p className="text-sm text-[var(--color-foreground-soft)] leading-relaxed">
              Mình nhận PR từ các brand beauty như La Roche-Posay, CeraVe,
              Garnier… nhưng không dùng hết. Thay vì để lãng phí, mình pass lại
              với giá mềm hơn store nhiều — đảm bảo chính hãng 100%, mọi đơn đều
              được quay unboxing trước khi gửi. 🎁
            </p>
            <div className="flex gap-2 flex-wrap">
              {["#beauty", "#skincare", "#PR", "#chínhhãng"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-medium px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <Button
              asChild
              size="lg"
              className="flex-1 rounded-full bg-[var(--color-primary-strong)] hover:bg-[var(--color-accent)] text-white shadow-md"
            >
              <Link href="/products">Xem sản phẩm</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="rounded-full px-4"
            >
              <a
                href="https://www.facebook.com/lannnnanhhhh"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-[#fe2c55]"
                >
                  <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
                </svg>
              </a>
            </Button>
          </div>
        </div>

        {/* Right: TikTok profile card + trust points */}
        <div className="space-y-5">
          {/* TikTok profile screenshot */}
          <TiltCard
            href="https://www.tiktok.com/@lananh113388"
            className="relative rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.12)] border-2 border-white mx-auto w-full max-w-[260px] lg:max-w-none aspect-[9/14]"
          >
            <Image
              src={profileTiktok}
              alt="TikTok profile Lan Anh"
              fill
              className="object-cover object-top"
            />
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
              </svg>
              <span className="text-white text-[10px] font-bold">VERIFIED</span>
            </div>
          </TiltCard>

          {/* Trust checklist */}
          <div className="space-y-2">
            {TRUST_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-white/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Icon
                    size={16}
                    className="text-[var(--color-primary-strong)] shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <p className="text-xs text-[var(--color-foreground-soft)] leading-relaxed">
                    {point.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
