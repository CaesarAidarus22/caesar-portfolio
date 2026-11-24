"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useApp } from "./Providers";
import { FadeUp, SectionLabel } from "./ui";

// kartu bergantian: brand, ink, blush, brandDeep
const TONES = ["bg-brand text-white", "bg-ink text-white", "bg-blush text-ink", "bg-brandDeep text-white"];
// tema kursor per kartu (blush terang → tanpa tema)
const THEMES = ["brand", "dark", undefined, "brand"];

const TOOLS = [
  "Python", "TensorFlow", "Scikit-learn", "OpenCV", "YOLO", "Whisper", "Gemini API",
  "FastAPI", "Node.js", "Express", "React", "Next.js", "TypeScript", "Tailwind CSS",
  "PostgreSQL", "Supabase", "MySQL", "Prisma", "Git", "Postman",
];

function Card({ i, title, body }: { i: number; title: string; body: string }) {
  return (
    <article data-theme={THEMES[i % THEMES.length]} className={`flex h-[24rem] w-full shrink-0 flex-col justify-between rounded-[1.75rem] p-7 md:h-[30rem] md:w-[26rem] md:p-9 ${TONES[i % TONES.length]}`}>
      <div className="flex items-start justify-between font-mono text-xs">
        <span>[0{i + 1}]</span>
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current opacity-90" aria-hidden>
          <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12C7 11 11 7 12 0Z" />
        </svg>
      </div>
      <div>
        <h3 className="display text-5xl md:text-6xl">{title}</h3>
        <p className="mt-4 max-w-xs text-[15px] leading-relaxed opacity-95">{body}</p>
      </div>
    </article>
  );
}

export default function Capabilities() {
  const { t } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);

  return (
    <section id="capabilities" className="bg-base">
      {/* desktop: scroll horizontal yang di-pin */}
      <div ref={ref} className="relative hidden h-[260vh] md:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="px-8">
            <SectionLabel n="03">{t.capabilities.label}</SectionLabel>
          </div>
          <motion.div style={{ x }} className="mt-10 flex items-center gap-6 pl-8">
            <h2 className="display w-[34rem] shrink-0 pr-10 text-[clamp(4rem,8vw,8rem)]">
              {t.capabilities.title.split(" ").slice(0, -1).join(" ")}{" "}
              <em className="text-brand">{t.capabilities.title.split(" ").slice(-1)}</em>
            </h2>
            {t.capabilities.items.map((c, i) => (
              <Card key={c.title} i={i} title={c.title} body={c.body} />
            ))}
            <div className="w-[20vw] shrink-0" />
          </motion.div>
        </div>
      </div>

      {/* mobile: tumpuk vertikal */}
      <div className="px-5 py-24 md:hidden">
        <SectionLabel n="03">{t.capabilities.label}</SectionLabel>
        <h2 className="display mt-6 text-6xl">{t.capabilities.title}</h2>
        <div className="mt-10 flex flex-col gap-4">
          {t.capabilities.items.map((c, i) => (
            <FadeUp key={c.title}>
              <Card i={i} title={c.title} body={c.body} />
            </FadeUp>
          ))}
        </div>
      </div>

      <div className="border-t border-ink/10 px-5 py-16 md:px-8 md:py-20">
        <div className="label mb-8">{t.toolbox.label}</div>
        <FadeUp>
          <ul className="flex flex-wrap gap-2.5">
            {TOOLS.map((tool) => (
              <li key={tool} className="rounded-full border border-line px-4 py-2 text-[15px] transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white">
                {tool}
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}
