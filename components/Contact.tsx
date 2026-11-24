"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useApp } from "./Providers";
import { Arrow, LocalClock, PillButton, SectionLabel } from "./ui";
import { site } from "@/lib/site";

export default function Contact() {
  const { t, lenis } = useApp();
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 0.8], ["20%", "0%"]);

  const socials = [
    ["GitHub", site.social.github],
    ["LinkedIn", site.social.linkedin],
    ["Instagram", site.social.instagram],
    ["TikTok", site.social.tiktok],
    ["Spotify", site.social.spotify],
  ] as const;

  return (
    <footer ref={ref} id="contact" data-theme="dark" className="relative overflow-hidden rounded-t-[2.5rem] bg-ink px-5 pb-6 pt-20 text-white md:px-8 md:pt-28">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand/40 blur-[140px]" />

      <SectionLabel n="05" onBrand className="relative !text-white/60">{t.contact.label}</SectionLabel>

      <motion.h2 style={{ scale, y }} className="display relative mt-8 origin-left text-[clamp(4.5rem,15vw,16rem)]">
        {t.contact.big1}
        <br />
        <em className="text-brand">{t.contact.big2}</em>
      </motion.h2>

      <div className="relative mt-12 grid gap-10 md:grid-cols-12">
        <p className="max-w-md text-lg leading-relaxed text-white/75 md:col-span-5">{t.contact.sub}</p>
        <div className="flex flex-wrap gap-3 md:col-span-7 md:justify-end">
          <PillButton href={site.social.linkedin} variant="light" external>
            {t.contact.linkedin} <Arrow />
          </PillButton>
          <PillButton href={site.social.github} variant="light" external>
            GitHub <Arrow />
          </PillButton>
          {site.cvUrl && (
            <PillButton href={site.cvUrl} variant="light" download>
              {t.hero.cv} <Arrow className="rotate-90" />
            </PillButton>
          )}
        </div>
      </div>

      {site.email && (
        <button
          className="relative mt-14 block text-left text-[clamp(1.6rem,4vw,3.5rem)] font-medium tracking-tight underline decoration-white/30 underline-offset-8 hover:decoration-brand"
          data-cursor={copied ? t.contact.copied : "Copy"}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(site.email!);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            } catch {}
          }}
        >
          {site.email}
        </button>
      )}

      <div className="relative mt-24 grid gap-8 border-t border-white/15 pt-8 text-sm md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="label mb-3 !text-white/60">{t.contact.socials}</div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {socials.map(([name, href]) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                  {name} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <div className="label mb-3 !text-white/60">{t.status.local}</div>
          <div>
            {site.location} — <LocalClock />
          </div>
        </div>
        <div className="flex items-end justify-between gap-4 md:col-span-4 md:flex-col md:items-end">
          <button
            className="hover:text-brand"
            onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
          >
            {t.contact.back} ↑
          </button>
          <span className="text-white/60">
            © 2026 {site.name}. {t.contact.made}
          </span>
        </div>
      </div>
    </footer>
  );
}
