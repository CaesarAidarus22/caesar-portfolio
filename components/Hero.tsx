"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useApp } from "./Providers";
import { Arrow, EASE, PillButton, RevealLine } from "./ui";
import { site } from "@/lib/site";

function SplitName({ text, delay, className = "" }: { text: string; delay: number; className?: string }) {
  const { ready } = useApp();
  return (
    <span className={`flex overflow-hidden ${className}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ y: "105%", rotate: 6 }}
          animate={ready ? { y: "0%", rotate: 0 } : undefined}
          transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.045 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function SpinBadge({ text }: { text: string }) {

  return (
    // ukuran mengikuti wrapper; latar solid + ring agar terbaca saat menempel di tepi foto
    <div className="relative h-full w-full rounded-full bg-base ring-1 ring-line">
      <motion.svg viewBox="0 0 100 100" className="h-full w-full" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
        <defs>
          <path id="circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-ink font-mono" style={{ fontSize: 7.4 }}>
          <textPath href="#circle" textLength={236} lengthAdjust="spacing">
            {`${text} • ${site.location} • `.toUpperCase()}
          </textPath>
        </text>
      </motion.svg>
      <span className="absolute inset-0 m-auto flex h-[34%] w-[34%] items-center justify-center rounded-full bg-brand text-white">
        <Arrow className="rotate-90" />
      </span>
    </div>
  );
}

export default function Hero() {
  const { t, ready } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-8 pt-28 md:px-8 md:pb-10">
      {/* glow brand/blush tipis di latar */}
      <div className="pointer-events-none absolute -right-32 top-10 h-[40rem] w-[40rem] rounded-full bg-brand/10 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-blush/80 blur-[120px]" />

      <motion.div style={{ opacity: fade }} className="relative grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <motion.div
            className="label mb-6 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <span className="h-2 w-2 rounded-full bg-brand" />
            {t.hero.role} — {site.location}
          </motion.div>
          <h2 className="text-[clamp(2rem,4.6vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.035em]">
            <RevealLine immediate delay={0.55}>{t.hero.line1}</RevealLine>
            <RevealLine immediate delay={0.65}>
              <span className="font-serif font-normal italic text-brand">{t.hero.line2}</span>
            </RevealLine>
            <RevealLine immediate delay={0.75}>{t.hero.line3}</RevealLine>
          </h2>
        </div>

        <div className="flex flex-col gap-6 md:col-span-5 md:items-end md:text-right">
          <motion.p
            className="max-w-sm text-[15px] leading-relaxed text-muted md:text-[1rem]/6"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1, duration: 0.9, ease: EASE }}
          >
            {t.hero.sub}
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3 md:justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1.1, duration: 0.9, ease: EASE }}
          >
            <PillButton href={site.social.github} external>
              {t.hero.github} <Arrow />
            </PillButton>
            <PillButton href={site.cvUrl} variant="outline" download disabledLabel={t.hero.cvSoon}>
              {t.hero.cv} <Arrow className="rotate-90" />
            </PillButton>
          </motion.div>
        </div>
      </motion.div>

      <motion.h1
        style={{ y: nameY }}
        className="display relative mt-12 flex flex-wrap items-center gap-x-[0.18em] text-[26vw] leading-[0.85] text-ink md:mt-16 md:flex-nowrap md:text-[clamp(4.6rem,15.4vw,20rem)]"
        aria-label={site.shortName}
      >
        <SplitName text="Caesar" delay={0.15} />
        <motion.span
          className="relative hidden h-[0.62em] w-[1.05em] shrink-0 md:inline-block"
          initial={{ width: 0, opacity: 0 }}
          animate={ready ? { width: "1.05em", opacity: 1 } : undefined}
          transition={{ delay: 0.9, duration: 1.1, ease: EASE }}
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <motion.span style={{ scale: imgScale }} className="absolute inset-0 block">
              <Image src="/images/portrait-caesar.jpg" alt="" fill sizes="320px" className="object-cover object-[50%_27%]" priority />
            </motion.span>
          </span>
          {/* badge di luar pill: pusatnya melewati pojok kanan atas, ukuran relatif terhadap font nama (em); tracking-normal agar letter-spacing negatif h1 tidak membalik teks SVG */}
          <span className="absolute right-0 top-0 hidden h-[clamp(5.5rem,0.42em,8rem)] w-[clamp(5.5rem,0.42em,8rem)] translate-x-[55%] -translate-y-[60%] tracking-normal md:block">
            <SpinBadge text={t.status.available} />
          </span>
        </motion.span>
        <SplitName text="Aidarus" delay={0.35} className="italic text-brand" />
      </motion.h1>

      <motion.div
        className="label relative mt-4 flex justify-between"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ delay: 1.4 }}
      >
        <span>©2026 — Portfolio v2</span>
        <span className="flex items-center gap-2">
          {t.hero.scroll}
          <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            ↓
          </motion.span>
        </span>
      </motion.div>
    </section>
  );
}
