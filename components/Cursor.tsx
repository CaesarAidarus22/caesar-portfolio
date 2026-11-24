"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Kursor kustom: titik kecil yang membesar di atas link.
 * Elemen dengan data-cursor="Teks" menampilkan label di dalam lingkaran.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      setHover(!!el);
      setLabel(el?.dataset.cursor ?? null);
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 96 : hover ? 44 : 12;

  return (
    <motion.div
      className={`pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center rounded-full text-white ${label ? "bg-ink" : "bg-white"}`}
      // tanpa label: putih + difference agar terlihat di latar merah maupun putih
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", mixBlendMode: label ? "normal" : "difference" }}
      animate={{ width: size, height: size, opacity: hover && !label ? 0.35 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      aria-hidden
    >
      {label && <span className="font-mono text-[10px] uppercase tracking-[0.12em]">{label}</span>}
    </motion.div>
  );
}
