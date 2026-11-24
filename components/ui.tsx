"use client";

import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "./Providers";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Teks yang naik dari balik mask saat masuk viewport. */
export function RevealLine({
  children,
  delay = 0,
  className = "",
  immediate = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
}) {
  const { ready } = useApp();
  const variants = {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 1, ease: EASE, delay } },
  };
  // observer dipasang di wrapper (bukan anak yang tersembunyi di balik overflow)
  return (
    <motion.span
      className={`block overflow-hidden pb-[0.14em] -mb-[0.06em] ${className}`}
      initial="hidden"
      {...(immediate
        ? { animate: ready ? "show" : "hidden" }
        : { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } })}
    >
      <motion.span className="block" variants={variants}>
        {children}
      </motion.span>
    </motion.span>
  );
}

export function FadeUp({ delay = 0, className = "", children, ...rest }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Label section bernomor, mis. "/ 02 — Karya Terpilih" */
// onBrand: dipakai di atas latar merah, nomor dan garis jadi putih agar tetap terlihat
export function SectionLabel({ n, children, className = "", onBrand = false }: { n: string; children: React.ReactNode; className?: string; onBrand?: boolean }) {
  return (
    <div className={`label flex items-center gap-3 ${className}`}>
      <span className={onBrand ? "text-white" : "text-brand"}>/ {n}</span>
      <span className={`h-px w-8 ${onBrand ? "bg-white/25" : "bg-line"}`} />
      <span>{children}</span>
    </div>
  );
}

/** Tombol yang sedikit "tertarik" ke arah kursor. */
export function Magnetic({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  return (
    <motion.span
      ref={ref}
      className="inline-block"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

type BtnProps = {
  href?: string | null;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "light";
  external?: boolean;
  download?: boolean;
  disabledLabel?: string;
};

export function PillButton({ href, children, variant = "solid", external, download, disabledLabel }: BtnProps) {
  const base =
    "group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3.5 text-[15px] font-medium transition-colors duration-300";
  const styles = {
    solid: "bg-ink text-white",
    outline: "border border-ink/80 text-ink",
    light: "bg-white text-ink",
  }[variant];

  if (!href) {
    return (
      <span className={`${base} cursor-not-allowed border border-dashed border-ink/40 text-muted`} title={disabledLabel}>
        {disabledLabel ?? children}
      </span>
    );
  }

  return (
    <Magnetic>
      <a
        href={href}
        className={`${base} ${styles}`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: true } : {})}
      >
        <span className="absolute inset-0 translate-y-full rounded-full bg-brand transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
        <span className="relative z-10 flex items-center gap-3 transition-colors duration-300 group-hover:text-white">
          {children}
        </span>
      </a>
    </Magnetic>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

/** Jam lokal WIB yang berjalan. */
export function LocalClock() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time || "--:--"} WIB</span>;
}
