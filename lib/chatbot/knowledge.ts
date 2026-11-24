/**
 * Sumber pengetahuan chatbot: dibangun dari data yang sama dengan isi website
 * (lib/projects.ts + lib/site.ts + teks about di dictionary), jadi selalu sinkron.
 * Dipakai mode berbasis aturan (client) dan mode AI (server).
 */
import { getDictionary } from "@/lib/dictionary";
import { projects } from "@/lib/projects";
import { achievements, experience, site, type Locale, type SlotItem } from "@/lib/site";

/** Buang penanda TODO agar chatbot tidak pernah menyebut data yang belum diisi. */
export function clean(value?: string) {
  if (!value) return undefined;
  const v = value.replace(/\s*\(TODO:[^)]*\)/g, "").trim();
  return v && !/TODO/.test(v) ? v : undefined;
}

const slot = (items: SlotItem[], locale: Locale) =>
  items
    .map((it) => ({
      title: clean(it.title[locale]),
      org: clean(it.org[locale]),
      period: clean(it.period),
      description: clean(it.description?.[locale]),
    }))
    .filter((it): it is typeof it & { title: string } => Boolean(it.title));

export function getKnowledge(locale: Locale) {
  const t = getDictionary(locale);
  const items = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category[locale],
    year: p.year,
    summary: p.summary[locale],
    technologies: p.technologies,
    // angka asli dari data proyek, mis. "73.97% Akurasi uji"
    stats: (p.stats ?? []).map((s) => (s.label ? `${s.value} ${s.label[locale]}` : s.value)),
    results: p.results?.[locale],
    status: p.status?.[locale],
    githubUrl: p.githubUrl,
  }));
  return {
    name: site.name,
    shortName: site.shortName,
    location: site.location,
    bio: site.bio?.[locale] ?? t.about.statement,
    statement: t.about.statement,
    facts: t.about.facts.map(([label, value]) => [label, value] as const),
    capabilities: t.capabilities.items,
    projects: items,
    technologies: [...new Set(items.flatMap((p) => p.technologies))],
    experience: slot(experience, locale),
    achievements: slot(achievements, locale),
    social: site.social,
    email: site.email,
  };
}

export type Knowledge = ReturnType<typeof getKnowledge>;

/** Konteks teks untuk system prompt mode AI (dibangun di server). */
export function knowledgeText(locale: Locale) {
  const k = getKnowledge(locale);
  const lines = [
    `Name: ${k.name} (${k.shortName}), based in ${k.location}.`,
    `Bio: ${k.bio}`,
    `About: ${k.statement}`,
    ...k.facts.map(([label, value]) => `${label}: ${value}`),
    `Capabilities: ${k.capabilities.map((c) => `${c.title} — ${c.body}`).join(" | ")}`,
    "Projects:",
    ...k.projects.map((p) =>
      [
        `- ${p.title} (${p.category}, ${p.year}): ${p.summary}`,
        `  Tech: ${p.technologies.join(", ")}`,
        p.stats.length ? `  Stats: ${p.stats.join("; ")}` : "",
        p.results ? `  Results: ${p.results}` : "",
        p.status ? `  Status: ${p.status}` : "",
        p.githubUrl ? `  Repo: ${p.githubUrl}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    ),
    "Experience:",
    ...k.experience.map((e) => `- ${e.title}${e.org ? `, ${e.org}` : ""}${e.period ? ` (${e.period})` : ""}${e.description ? `: ${e.description}` : ""}`),
    "Competitions:",
    ...k.achievements.map((a) => `- ${a.title}${a.period ? ` (${a.period})` : ""}${a.org ? ` — ${a.org}` : ""}${a.description ? `: ${a.description}` : ""}`),
    `Contact: LinkedIn ${k.social.linkedin}; GitHub ${k.social.github}${k.email ? `; email ${k.email}` : ""}.`,
  ];
  return lines.join("\n");
}
