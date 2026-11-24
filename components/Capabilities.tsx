"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import type * as ToolIcons from "./toolIcons";
import { useApp } from "./Providers";
import { EASE, FadeUp, SectionLabel } from "./ui";

// kartu bergantian: brand, ink, blush, brandDeep
const TONES = ["bg-brand text-white", "bg-ink text-white", "bg-blush text-ink", "bg-brandDeep text-white"];
// tema kursor per kartu (blush terang → tanpa tema)
const THEMES = ["brand", "dark", undefined, "brand"];

// icon = nama named export di ./toolIcons; null → fallback monogram
type IconKey = keyof typeof ToolIcons;
type Tool = { name: string; icon: IconKey | null; mono?: string };
const TOOLS: Tool[] = [
  { name: "Python", icon: "siPython" },
  { name: "TensorFlow", icon: "siTensorflow" },
  { name: "Scikit-learn", icon: "siScikitlearn" },
  { name: "OpenCV", icon: "siOpencv" },
  { name: "YOLO", icon: "siUltralytics" },
  { name: "Whisper", icon: null, mono: "W" }, // tidak ada di simple-icons
  { name: "Gemini API", icon: "siGooglegemini" },
  { name: "FastAPI", icon: "siFastapi" },
  { name: "Node.js", icon: "siNodedotjs" },
  { name: "Express", icon: "siExpress" },
  { name: "React", icon: "siReact" },
  { name: "Next.js", icon: "siNextdotjs" },
  { name: "TypeScript", icon: "siTypescript" },
  { name: "Tailwind CSS", icon: "siTailwindcss" },
  { name: "PostgreSQL", icon: "siPostgresql" },
  { name: "Supabase", icon: "siSupabase" },
  { name: "MySQL", icon: "siMysql" },
  { name: "Prisma", icon: "siPrisma" },
  { name: "Git", icon: "siGit" },
  { name: "Postman", icon: "siPostman" },
];

// sel kosong bergaris putus-putus agar baris terakhir tetap rata bila jumlah tool tidak habis dibagi kolom
const need = (cols: number) => (cols - (TOOLS.length % cols)) % cols;
const FILLERS = Array.from({ length: Math.max(need(2), need(4), need(5)) }, (_, j) =>
  [j < need(2) ? "block" : "hidden", j < need(4) ? "sm:block" : "sm:hidden", j < need(5) ? "lg:block" : "lg:hidden"].join(" "),
);

/** Logo monokrom (currentColor) atau monogram dalam lingkaran. */
type IconMap = typeof ToolIcons | null;
function ToolGlyph({ tool, icons, className = "" }: { tool: Tool; icons: IconMap; className?: string }) {
  if (tool.icon) {
    // sebelum chunk ikon termuat: kosong (lebar slot tetap)
    const path = icons?.[tool.icon].path;
    return (
      <svg viewBox="0 0 24 24" className={`h-full w-full fill-current ${className}`} aria-hidden>
        {path && <path d={path} />}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={`h-full w-full ${className}`} aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <text x="12" y="16" textAnchor="middle" className="fill-current font-mono" style={{ fontSize: 11 }}>
        {tool.mono}
      </text>
    </svg>
  );
}

/** Animasi hanya jalan saat terlihat dan tidak ada prefers-reduced-motion. */
function usePlay() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  return [ref, inView && !reduce] as const;
}

const loop = (duration: number, times?: number[], delay = 0) => ({ duration, times, delay, repeat: Infinity, ease: "easeInOut" as const });
const still = { duration: 0 };

/** [01] objek geometris + bounding box yang "mengunci" + label deteksi. */
function IlloVision() {
  const [ref, play] = usePlay();
  const tight = { x: 78, y: 26, width: 44, height: 76 };
  const loose = { x: 52, y: 10, width: 96, height: 104 };
  const times = [0, 0.3, 0.85, 1];
  return (
    <div ref={ref} className="h-full w-full">
      <svg viewBox="0 0 200 120" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* siluet objek */}
        <circle cx="100" cy="44" r="12" className="fill-current" opacity="0.35" />
        <rect x="84" y="60" width="32" height="38" rx="8" className="fill-current" opacity="0.35" />
        <motion.rect
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeDasharray="4 3"
          rx="3"
          initial={tight}
          animate={
            play
              ? { x: [loose.x, tight.x, tight.x, loose.x], y: [loose.y, tight.y, tight.y, loose.y], width: [loose.width, tight.width, tight.width, loose.width], height: [loose.height, tight.height, tight.height, loose.height] }
              : tight
          }
          transition={play ? loop(4, times) : still}
        />
        <motion.g initial={{ opacity: 1 }} animate={{ opacity: play ? [0, 0, 1, 1, 0] : 1 }} transition={play ? loop(4, [0, 0.3, 0.38, 0.85, 1]) : still}>
          <rect x="78" y="12" width="62" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
          <text x="82" y="21" className="fill-current font-mono" style={{ fontSize: 8 }}>
            object 0.97
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

const TOKENS = [
  { t: "aku", en: false },
  { t: "mau", en: false },
  { t: "deploy", en: true },
  { t: "model", en: true },
];
const BARS = [0.35, 0.7, 0.5, 0.9, 0.4, 0.75, 1, 0.6, 0.3, 0.8, 0.55, 0.95, 0.45, 0.7, 0.35, 0.6];

/** [02] waveform yang berganti menjadi token campuran ID/EN (code-switching). */
function IlloSpeech() {
  const [ref, play] = usePlay();
  return (
    <div ref={ref} className="relative h-full w-full">
      <motion.div
        className="absolute inset-0 flex items-center gap-[5px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: play ? [1, 1, 0, 0, 1] : 0 }}
        transition={play ? loop(5, [0, 0.4, 0.5, 0.92, 1]) : still}
      >
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className="h-16 w-[5px] origin-center rounded-full bg-current"
            initial={{ scaleY: h }}
            animate={{ scaleY: play ? [h, Math.max(0.15, 1 - h), h] : h }}
            transition={play ? loop(1.2, undefined, i * 0.06) : still}
          />
        ))}
      </motion.div>
      <div className="absolute inset-0 flex flex-wrap content-center items-center gap-2">
        {TOKENS.map((k, i) => (
          <motion.span
            key={k.t}
            // token EN bergaris putus-putus: menandai pergantian bahasa
            className={`rounded-md border border-current px-2 py-1 font-mono text-[12px] ${k.en ? "border-dashed" : ""}`}
            initial={{ opacity: 1, y: 0 }}
            animate={play ? { opacity: [0, 0, 1, 1, 0], y: [6, 6, 0, 0, 0] } : { opacity: 1, y: 0 }}
            transition={play ? loop(5, [0, 0.5 + i * 0.05, 0.58 + i * 0.05, 0.92, 1]) : still}
          >
            {k.t}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/** [03] potongan terminal request → response dengan kursor ketik. */
function IlloApi() {
  const [ref, play] = usePlay();
  return (
    <div ref={ref} className="flex h-full w-full items-center">
      <div className="w-full rounded-xl border border-current/25 p-3 font-mono text-[12px] leading-6">
        <div className="mb-1 flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
          ))}
        </div>
        <motion.div
          className="whitespace-nowrap"
          initial={{ clipPath: "inset(0 0% 0 0)" }}
          animate={{ clipPath: play ? ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 100% 0 0)"] : "inset(0 0% 0 0)" }}
          transition={play ? { ...loop(4, [0, 0.3, 0.9, 1]), ease: "linear" } : still}
        >
          $ POST /predict
        </motion.div>
        <motion.div
          className="whitespace-nowrap"
          initial={{ opacity: 1 }}
          animate={{ opacity: play ? [0, 0, 1, 1, 0] : 1 }}
          transition={play ? loop(4, [0, 0.42, 0.46, 0.9, 1]) : still}
        >
          → 200 OK · 42ms
        </motion.div>
        <div className="flex items-center gap-1">
          $
          <motion.span
            className="inline-block h-3.5 w-[7px] bg-current"
            initial={{ opacity: 1 }}
            animate={{ opacity: play ? [1, 1, 0, 0] : 1 }}
            transition={play ? { duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" } : still}
          />
        </div>
      </div>
    </div>
  );
}

/** [04] wireframe UI mini yang elemennya muncul bertahap. */
function IlloUi() {
  const [ref, play] = usePlay();
  const step = (k: number) => ({
    initial: { opacity: 1, y: 0 },
    animate: play ? { opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, 0] } : { opacity: 1, y: 0 },
    transition: play ? loop(4.5, [0, 0.08 + k * 0.1, 0.18 + k * 0.1, 0.88, 1]) : still,
  });
  return (
    <div ref={ref} className="flex h-full w-full items-center">
      {/* tinggi mengikuti ruang yang tersedia agar tidak menabrak judul di mobile */}
      <div className="flex h-full max-h-40 w-full flex-col gap-2 rounded-xl border border-current/30 p-3">
        <motion.div {...step(0)} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-current" />
          <span className="h-1.5 w-16 rounded-full bg-current opacity-60" />
          <span className="ml-auto h-1.5 w-8 rounded-full bg-current opacity-40" />
        </motion.div>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-2">
          {[1, 2].map((k) => (
            <motion.div key={k} {...step(k)} className="flex min-h-0 flex-col justify-end gap-1 rounded-lg border border-current/40 p-2">
              <span className="h-1.5 w-3/4 rounded-full bg-current opacity-60" />
              <span className="h-1.5 w-1/2 rounded-full bg-current opacity-30" />
            </motion.div>
          ))}
        </div>
        <motion.div {...step(3)} className="h-5 w-20 shrink-0 self-end rounded-full bg-current" />
      </div>
    </div>
  );
}

const ILLOS = [IlloVision, IlloSpeech, IlloApi, IlloUi];

function Card({ i, title, body, lastRef }: { i: number; title: string; body: string; lastRef?: React.Ref<HTMLElement> }) {
  const Illo = ILLOS[i % ILLOS.length];
  return (
    <article ref={lastRef} data-theme={THEMES[i % THEMES.length]} className={`flex h-[24rem] w-full shrink-0 flex-col justify-between rounded-[1.75rem] p-7 md:h-[30rem] md:w-[26rem] md:p-9 ${TONES[i % TONES.length]}`}>
      <div className="flex items-start justify-between font-mono text-xs">
        <span>[0{i + 1}]</span>
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current opacity-90" aria-hidden>
          <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12C7 11 11 7 12 0Z" />
        </svg>
      </div>
      {/* ilustrasi mengisi ruang antara nomor dan judul */}
      <div className="my-4 min-h-0 flex-1 overflow-hidden" aria-hidden>
        <Illo />
      </div>
      <div>
        <h3 className="display text-5xl md:text-6xl">{title}</h3>
        <p className="mt-4 max-w-xs text-[15px] leading-relaxed opacity-95">{body}</p>
      </div>
    </article>
  );
}

/** Kartu logo mengambang mengikuti kursor (hanya pointer halus, tanpa reduced motion). */
function useFloatCard() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);
  return enabled;
}

export default function Capabilities() {
  const { t } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastCardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // jarak geser = tepi kanan kartu terakhir − (lebar layar − 8vw), diukur dari konten sebenarnya
  const [dist, setDist] = useState(0);
  const distMV = useMotionValue(0);
  const x = useTransform(() => -scrollYProgress.get() * distMV.get());
  useEffect(() => {
    const track = trackRef.current;
    const last = lastCardRef.current;
    if (!track || !last) return;
    const measure = () => {
      const right = last.getBoundingClientRect().right - track.getBoundingClientRect().left;
      const d = Math.max(0, Math.round(right - window.innerWidth * 0.92));
      distMV.set(d);
      setDist(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [distMV]);

  const floatOn = useFloatCard();
  const [icons, setIcons] = useState<IconMap>(null);
  useEffect(() => {
    import("./toolIcons").then(setIcons);
  }, []);
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 20 });
  const sy = useSpring(my, { stiffness: 150, damping: 20 });

  const items = t.capabilities.items;

  return (
    <section id="capabilities" className="bg-base">
      {/* desktop: scroll horizontal yang di-pin; tinggi = 1 layar + jarak geser (1px scroll = 1px geser) */}
      <div ref={ref} className="relative hidden h-[260vh] md:block" style={dist ? { height: `calc(100vh + ${dist}px)` } : undefined}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="px-8">
            <SectionLabel n="03">{t.capabilities.label}</SectionLabel>
          </div>
          <motion.div ref={trackRef} style={{ x }} className="mt-10 flex items-center gap-6 pl-8">
            <h2 className="display w-[34rem] shrink-0 pr-10 text-[clamp(4rem,8vw,8rem)]">
              {t.capabilities.title.split(" ").slice(0, -1).join(" ")}{" "}
              <em className="text-brand">{t.capabilities.title.split(" ").slice(-1)}</em>
            </h2>
            {items.map((c, i) => (
              <Card key={c.title} i={i} title={c.title} body={c.body} lastRef={i === items.length - 1 ? lastCardRef : undefined} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* mobile: tumpuk vertikal */}
      <div className="px-5 py-24 md:hidden">
        <SectionLabel n="03">{t.capabilities.label}</SectionLabel>
        <h2 className="display mt-6 text-6xl">{t.capabilities.title}</h2>
        <div className="mt-10 flex flex-col gap-4">
          {items.map((c, i) => (
            <FadeUp key={c.title}>
              <Card i={i} title={c.title} body={c.body} />
            </FadeUp>
          ))}
        </div>
      </div>

      <div className="border-t border-ink/10 px-5 py-16 md:px-8 md:py-20">
        <div className="label mb-8">{t.toolbox.label}</div>
        <FadeUp>
          <ul
            // grid kolom sama lebar: 2 / 4 / 5 kolom (20 tool → baris selalu penuh)
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-5"
            onPointerMove={(e) => {
              mx.set(e.clientX);
              my.set(e.clientY);
            }}
            onPointerLeave={() => setActive(null)}
          >
            {TOOLS.map((tool, i) => (
              <li
                key={tool.name}
                // pill jadi merah saat hover → kursor putih agar tetap terlihat
                data-theme="brand"
                onPointerEnter={() => setActive(i)}
                // font mengecil di 4 kolom (640–1023px) agar nama panjang tidak terpotong
                className="group flex h-11 min-w-0 items-center justify-center whitespace-nowrap rounded-full border border-line px-3 text-[15px] transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white sm:text-[clamp(12px,1.6vw,15px)] lg:text-[15px]"
              >
                <span className="tool-logo" aria-hidden>
                  <ToolGlyph tool={tool} icons={icons} />
                </span>
                {tool.name}
              </li>
            ))}
            {FILLERS.map((cls, j) => (
              <li key={`kosong-${j}`} aria-hidden className={`h-11 rounded-full border border-dashed border-line ${cls}`} />
            ))}
          </ul>
        </FadeUp>
      </div>

      {floatOn && (
        <motion.div
          data-theme="dark"
          className="pointer-events-none fixed left-0 top-0 z-30 flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-2xl bg-ink text-white"
          // kartu di kanan-atas kursor agar tidak menutupi pill yang sedang di-hover
          style={{ x: sx, y: sy, translateX: 20, translateY: "calc(-100% - 20px)" }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: active === null ? 0.8 : 1, opacity: active === null ? 0 : 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          aria-hidden
        >
          <AnimatePresence mode="wait" initial={false}>
            {active !== null && (
              <motion.div
                key={active}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                <span className="block h-11 w-11">
                  <ToolGlyph tool={TOOLS[active]} icons={icons} />
                </span>
                <span className="max-w-[5.5rem] truncate font-mono text-[10px] uppercase tracking-[0.08em]">{TOOLS[active].name}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
