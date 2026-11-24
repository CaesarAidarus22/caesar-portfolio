"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useApp } from "./Providers";
import { FadeUp, SectionLabel } from "./ui";
import { site } from "@/lib/site";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

/** Kalimat yang "menyala" kata per kata mengikuti scroll. */
function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="text-[clamp(1.8rem,4.2vw,3.9rem)] font-medium leading-[1.08] tracking-[-0.035em]">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

export default function About() {
  const { t, locale } = useApp();
  const bio = site.bio?.[locale];

  return (
    <section id="about" className="px-5 py-24 md:px-8 md:py-36">
      <SectionLabel n="01">{t.about.label}</SectionLabel>

      <div className="mt-10 max-w-6xl">
        <ScrollStatement text={t.about.statement} />
      </div>

      <div className="mt-20 grid gap-10 md:grid-cols-12">
        <FadeUp className="md:col-span-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-blush">
            <Image src="/images/caesar-about.jpeg" alt={site.name} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
          </div>
        </FadeUp>

        <div className="flex flex-col justify-end gap-12 md:col-span-7 md:col-start-6">
          <FadeUp delay={0.1}>
            {bio ? (
              <p className="max-w-xl text-lg leading-relaxed md:text-xl">{bio}</p>
            ) : (
              <div className="rounded-2xl border border-dashed border-ink/30 p-6 text-muted">
                <span className="label mb-2 block !text-brand">Slot</span>
                {t.about.bioSlot}
              </div>
            )}
          </FadeUp>

          <dl className="grid grid-cols-1 border-t border-ink/15 sm:grid-cols-2">
            {t.about.facts.map(([k, v], i) => (
              <FadeUp key={k} delay={0.05 * i} className="border-b border-ink/15 py-5 sm:odd:pr-6">
                <dt className="label">{k}</dt>
                <dd className="mt-1 text-lg">{v}</dd>
              </FadeUp>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
