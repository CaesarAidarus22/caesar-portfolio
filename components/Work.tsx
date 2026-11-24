"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import { useApp } from "./Providers";
import { Arrow, EASE, RevealLine, SectionLabel } from "./ui";
import { projects, type Project } from "@/lib/projects";

export const toneBg: Record<Project["tone"], string> = {
  brand: "bg-brand text-white",
  brandDeep: "bg-brandDeep text-white",
  blush: "bg-blush text-ink",
  ink: "bg-ink text-white",
};

/** Visual pengganti untuk proyek yang belum punya gambar. */
export function ProjectPoster({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <div className={`flex h-full w-full flex-col justify-between p-5 ${toneBg[project.tone]}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-95">{project.technologies.slice(0, 3).join(" · ")}</span>
      <span className={`display ${large ? "text-[clamp(3rem,8vw,7rem)]" : "text-5xl"} italic`}>{project.title}</span>
    </div>
  );
}

export default function Work() {
  const { t, locale } = useApp();
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });

  return (
    <section
      id="work"
      data-theme="brand"
      className="relative bg-brand px-5 py-24 text-white md:px-8 md:py-32"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
    >
      <div className="flex items-end justify-between gap-6">
        <div>
          <SectionLabel n="02" onBrand className="!text-white/95">{t.work.label}</SectionLabel>
          <h2 className="display mt-6 text-[clamp(4rem,12vw,11rem)]">
            <RevealLine>{t.work.title}</RevealLine>
          </h2>
        </div>
        <span className="label mb-4 hidden !text-white/95 md:block">
          ({String(projects.length).padStart(2, "0")}) {t.work.all}
        </span>
      </div>

      <ul className="mt-10 border-t border-white/25" onPointerLeave={() => setActive(null)}>
        {projects.map((p, i) => (
          <motion.li
            key={p.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.04 }}
            onPointerEnter={() => setActive(i)}
            className="border-b border-white/25"
          >
            <Link
              href={`/${locale}/projects/${p.slug}`}
              data-cursor={t.work.view.split(" ")[0]}
              className="group relative grid grid-cols-12 items-center gap-3 py-6 md:py-8"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-brandDeep transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
              <span className="relative col-span-2 font-mono text-xs text-white/95 md:col-span-1">{p.number}</span>
              <span className="relative col-span-10 md:col-span-6">
                <span className="block text-[clamp(1.7rem,3.6vw,3.3rem)] font-medium leading-none tracking-[-0.035em] transition-transform duration-500 group-hover:translate-x-3">
                  {p.title}
                </span>
                <span className="mt-2 block text-sm text-white/95 md:hidden">{p.summary[locale]}</span>
              </span>
              <span className="relative col-span-6 col-start-3 text-sm text-white/95 md:col-span-3 md:col-start-auto">{p.category[locale]}</span>
              <span className="relative col-span-4 flex items-center justify-end gap-3 font-mono text-xs md:col-span-2">
                {p.year}
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 transition-all duration-500 group-hover:rotate-45 group-hover:border-white group-hover:bg-white group-hover:text-brand">
                  <Arrow />
                </span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>

      {/* preview yang mengikuti kursor (desktop) */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[17rem] w-[24rem] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/40 md:block"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: active === null ? 0 : 1, opacity: active === null ? 0 : 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        aria-hidden
      >
        <AnimatePresence initial={false}>
          {active !== null && (
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {projects[active].image ? (
                <Image src={projects[active].image!} alt="" fill sizes="384px" className="object-cover" />
              ) : (
                <ProjectPoster project={projects[active]} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
