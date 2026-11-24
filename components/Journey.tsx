"use client";

import { useApp } from "./Providers";
import { FadeUp, RevealLine, SectionLabel } from "./ui";
import { achievements, experience, type SlotItem } from "@/lib/site";

function Column({ title, items, slot }: { title: string; items: SlotItem[]; slot: string }) {
  const { locale } = useApp();
  return (
    <div>
      <h3 className="label mb-4 !text-ink">{title}</h3>
      <ul className="border-t border-ink/20">
        {items.length === 0
          ? [0, 1].map((i) => (
              <li key={i} className="my-3 rounded-xl border border-dashed border-ink/30 px-5 py-6 text-sm text-muted">
                <span className="font-mono text-xs text-brand">0{i + 1}</span> — {slot}
              </li>
            ))
          : items.map((it, i) => (
              <FadeUp key={i} className="grid grid-cols-12 gap-3 border-b border-ink/20 py-6">
                <span className="col-span-3 font-mono text-xs text-muted">{it.period}</span>
                <div className="col-span-9">
                  <div className="text-xl font-medium tracking-tight">{it.title[locale]}</div>
                  <div className="text-sm text-muted">{it.org[locale]}</div>
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
        <Column title={t.journey.experience} items={experience} slot={t.journey.slot} />
        <Column title={t.journey.achievements} items={achievements} slot={t.journey.slot} />
      </div>
    </section>
  );
}
