"use client";

import { useApp } from "./Providers";
import { FadeUp, RevealLine, SectionLabel } from "./ui";
import { achievements, byRecent, experience, type SlotItem } from "@/lib/site";

function Column({ title, items }: { title: string; items: SlotItem[] }) {
  const { locale, t } = useApp();
  return (
    <div>
      <h3 className="label mb-4 !text-ink">{title}</h3>
      <ul className="border-t border-ink/20">
        {byRecent(items).map((it, i) => (
          <FadeUp key={i} className="grid grid-cols-12 gap-3 border-b border-ink/20 py-6">
            {/* period kosong: kolom periode tidak dirender, judul memakai lebar penuh */}
            {it.period !== "" && <span className="col-span-3 font-mono text-xs text-muted">{it.period}</span>}
            <div className={it.period !== "" ? "col-span-9" : "col-span-12"}>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="text-xl font-medium tracking-tight">{it.title[locale]}</span>
                {it.highlight && (
                  <span className="rounded-full bg-brand px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white">
                    {t.journey.highlight}
                  </span>
                )}
              </div>
              <div className={`text-sm ${it.highlight ? "text-brand" : "text-muted"}`}>{it.org[locale]}</div>
              {it.description && <p className="mt-2 text-[15px] leading-relaxed">{it.description[locale]}</p>}
            </div>
          </FadeUp>
        ))}
      </ul>
    </div>
  );
}

export default function Journey() {
  const { t } = useApp();
  return (
    <section id="journey" className="bg-surface px-5 py-24 md:px-8 md:py-36">
      <SectionLabel n="04">{t.journey.label}</SectionLabel>
      <h2 className="display mt-6 max-w-5xl text-[clamp(3.5rem,9vw,8.5rem)]">
        <RevealLine>{t.journey.title}</RevealLine>
      </h2>
      <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
        <Column title={t.journey.experience} items={experience} />
        <Column title={t.journey.achievements} items={achievements} />
      </div>
    </section>
  );
}
