"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useApp } from "./Providers";
import { Arrow, EASE, FadeUp, PillButton, RevealLine } from "./ui";
import { ProjectPoster } from "./Work";
import { getNextProject, getProject } from "@/lib/projects";
import type { L } from "@/lib/site";

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <FadeUp className="grid gap-4 border-t border-ink/15 py-10 md:grid-cols-12 md:py-14">
      <div className="label md:col-span-3">
        <span className="text-brand">{n}</span> — {title}
      </div>
      <div className="md:col-span-8 md:col-start-5">{children}</div>
    </FadeUp>
  );
}

function List({ items, locale }: { items: L[]; locale: "id" | "en" }) {
  return (
    <ol className="space-y-4">
      {items.map((it, i) => (
        <li key={i} className="flex gap-5 text-lg leading-snug md:text-xl">
          <span className="mt-1.5 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
          {it[locale]}
        </li>
      ))}
    </ol>
  );
}

export default function ProjectView({ slug }: { slug: string }) {
  const { t, locale } = useApp();
  const p = getProject(slug)!;
  const next = getNextProject(slug);
  const media = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: media, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const blocks: Array<[string, React.ReactNode]> = [];
  if (p.problem) blocks.push([t.project.problem, <p key="p" className="text-xl leading-relaxed md:text-2xl">{p.problem[locale]}</p>]);
  if (p.solution) blocks.push([t.project.solution, <p key="s" className="text-xl leading-relaxed md:text-2xl">{p.solution[locale]}</p>]);
  if (p.architecture) blocks.push([t.project.architecture, <List key="a" items={p.architecture} locale={locale} />]);
  if (p.challenges) blocks.push([t.project.challenges, <List key="c" items={p.challenges} locale={locale} />]);
  if (p.results) blocks.push([t.project.results, <p key="r" className="text-xl leading-relaxed md:text-2xl">{p.results[locale]}</p>]);
  if (p.lessons)
    blocks.push([
      t.project.lessons,
      <p key="l" className="font-serif text-3xl italic leading-tight md:text-4xl">
        “{p.lessons[locale]}”
      </p>,
    ]);

  return (
    <main className="px-5 pt-32 md:px-8 md:pt-40">
      <Link href={`/${locale}#work`} className="label inline-flex items-center gap-2 hover:!text-ink">
        ← {t.project.back}
      </Link>

      <div className="mt-8 flex flex-wrap items-baseline gap-4">
        <span className="font-mono text-sm text-brand">{p.number}</span>
        <span className="label">{p.category[locale]}</span>
      </div>
      <h1 className="display mt-4 text-[clamp(3.5rem,11vw,10rem)]">
        <RevealLine immediate>{p.title}</RevealLine>
      </h1>
      <motion.p
        className="mt-6 max-w-2xl text-xl leading-relaxed text-muted md:text-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
      >
        {p.summary[locale]}
      </motion.p>

      <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-ink/15 pt-6 md:grid-cols-4">
        <div>
          <dt className="label">{t.project.year}</dt>
          <dd className="mt-1">{p.year}</dd>
        </div>
        {p.role && (
          <div>
            <dt className="label">{t.project.role}</dt>
            <dd className="mt-1">{p.role[locale]}</dd>
          </div>
        )}
        <div className="col-span-2">
          <dt className="label">{t.project.stack}</dt>
          <dd className="mt-1">{p.technologies.join(" · ")}</dd>
        </div>
      </dl>

      <div ref={media} className="relative mt-12 aspect-[16/10] overflow-hidden rounded-[1.75rem] md:aspect-[16/8]">
        {p.image ? (
          <motion.div style={{ y: imgY }} className="absolute -inset-y-[10%] inset-x-0">
            <Image src={p.image} alt={p.title} fill sizes="100vw" className="object-cover" priority />
          </motion.div>
        ) : (
          <ProjectPoster project={p} large />
        )}
      </div>

      {p.stats && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          {p.stats.map((s) => (
            <FadeUp key={s.value} className="rounded-2xl bg-blush p-5 md:p-7">
              <div className="display text-4xl md:text-7xl">{s.value}</div>
              {s.label && <div className="label mt-2">{s.label[locale]}</div>}
            </FadeUp>
          ))}
        </div>
      )}

      <div className="mt-16">
        {blocks.map(([title, node], i) => (
          <Block key={title} n={String(i + 1).padStart(2, "0")} title={title}>
            {node}
          </Block>
        ))}
        {p.status && (
          <Block n="—" title="Status">
            <p className="text-lg text-muted">{p.status[locale]}</p>
          </Block>
        )}
      </div>

      {p.githubUrl && (
        <div className="flex justify-center border-t border-ink/15 py-14">
          <PillButton href={p.githubUrl} external>
            {t.project.openRepo} <Arrow />
          </PillButton>
        </div>
      )}

      <Link
        href={`/${locale}/projects/${next.slug}`}
        data-theme="brand"
        className="group mb-24 mt-6 block rounded-[1.75rem] bg-brand p-8 text-white md:p-12"
        data-cursor={t.project.next.split(" ")[0]}
      >
        <span className="label !text-white">{t.project.next} →</span>
        <span className="display mt-4 block text-[clamp(3rem,9vw,8rem)] transition-colors duration-500 group-hover:text-ink">
          {next.title}
        </span>
      </Link>
    </main>
  );
}
