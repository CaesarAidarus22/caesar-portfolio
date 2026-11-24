import type { Locale } from "@/lib/site";
import { detectIntent } from "./detectIntent";
import { getKnowledge, type Knowledge } from "./knowledge";
import { normalizeText } from "./normalizeText";
import type { ChatAction, ChatContext, ChatIntent, ChatResponse } from "./types";

type Bi = Record<Locale, string>;

function list(items: readonly string[], lang: Locale) {
  if (items.length < 2) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} ${lang === "id" ? "dan" : "and"} ${items.at(-1)}`;
}

const action = (label: Bi, href: string, lang: Locale, external = false): ChatAction => ({ label: label[lang], href, external });

// pengelompokan teknologi; hanya yang benar-benar muncul di data proyek yang disebut
const GROUPS = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript"],
  backend: ["FastAPI", "Node.js", "Express", "PostgreSQL", "Supabase", "MySQL", "Prisma", "REST API"],
  ai: ["TensorFlow", "PyTorch", "EfficientNetB0", "Scikit-learn", "OpenCV", "YOLO", "YOLOv8", "Whisper", "Gemini AI", "Gemini", "Python"],
};
const AI_HINT = /AI|Vision|NLP|Speech|TensorFlow|PyTorch|YOLO|Whisper|Gemini|EfficientNet|Machine Learning|Sentiment/i;

type Project = Knowledge["projects"][number];

/** Cari proyek yang disebut di pertanyaan (judul, slug, atau dua kata pertama judul). */
function findProject(normalized: string, k: Knowledge): Project | undefined {
  return k.projects.find((p) => {
    const title = normalizeText(p.title);
    const aliases = [title, normalizeText(p.slug.replace(/-/g, " ")), title.split(" ").slice(0, 2).join(" ")];
    return aliases.some((a) => a.length > 3 && normalized.includes(a));
  });
}

const TECH_FOLLOWUP = /(teknologi|tech|pakai|use|stack|dibuat dengan|built with)/;

export function generateResponse(question: string, lang: Locale, previous: ChatContext = {}): ChatResponse {
  const k = getKnowledge(lang);
  const normalized = normalizeText(question);
  const home = `/${lang}`;
  const caseStudy = (p: Project) => action({ id: `Buka ${p.title}`, en: `Open ${p.title}` }, `${home}/projects/${p.slug}`, lang);
  const linkedin = action({ id: "Buka LinkedIn", en: "Open LinkedIn" }, k.social.linkedin, lang, true);
  const github = action({ id: "Buka GitHub", en: "Open GitHub" }, k.social.github, lang, true);
  const workLink = action({ id: "Lihat proyek", en: "View projects" }, `${home}#work`, lang);

  const mentioned = findProject(normalized, k);
  let intent: ChatIntent;
  if (mentioned) intent = TECH_FOLLOWUP.test(normalized) ? "project_technology" : "project_detail";
  // pertanyaan lanjutan: satu proyek sedang dibahas, atau "yang pertama" dari daftar sebelumnya
  else if (
    TECH_FOLLOWUP.test(normalized) &&
    (previous.lastProjectSlugs?.length === 1 || (previous.lastProjectSlugs?.length && /(yang pertama|first one|the first)/.test(normalized)))
  )
    intent = "project_technology";
  else intent = detectIntent(question);

  let text = "";
  let actions: ChatAction[] = [];
  let lastProjectSlugs = previous.lastProjectSlugs;
  const usedTech = (group: readonly string[]) => group.filter((g) => k.technologies.includes(g));
  const study = k.facts.find(([label]) => /stud/i.test(label))?.[1];

  switch (intent) {
    case "identity":
      // bio ditulis orang pertama, jadi dikutip apa adanya
      text = lang === "id" ? `${k.name}. Dalam kata-katanya sendiri: “${k.bio}”` : `${k.name}. In his own words: “${k.bio}”`;
      actions = [action({ id: "Tentang Caesar", en: "About Caesar" }, `${home}#about`, lang), linkedin];
      break;
    case "education":
      text = study
        ? lang === "id" ? `Caesar menempuh studi ${study}.` : `Caesar studies ${study}.`
        : k.bio;
      actions = [action({ id: "Tentang Caesar", en: "About Caesar" }, `${home}#about`, lang)];
      break;
    case "projects":
      text = lang === "id"
        ? `Ada ${k.projects.length} proyek di portofolio ini: ${list(k.projects.map((p) => p.title), lang)}. Sebut salah satu namanya untuk detail.`
        : `This portfolio features ${k.projects.length} projects: ${list(k.projects.map((p) => p.title), lang)}. Name one for details.`;
      lastProjectSlugs = k.projects.map((p) => p.slug);
      actions = [workLink];
      break;
    case "ai_projects": {
      const ai = k.projects.filter((p) => AI_HINT.test(`${p.category} ${p.technologies.join(" ")}`));
      text = lang === "id" ? `Proyek AI Caesar: ${list(ai.map((p) => p.title), lang)}.` : `Caesar's AI projects: ${list(ai.map((p) => p.title), lang)}.`;
      lastProjectSlugs = ai.map((p) => p.slug);
      actions = ai.slice(0, 3).map(caseStudy);
      break;
    }
    case "project_detail": {
      const p = mentioned!;
      const stats = p.stats.length ? (lang === "id" ? ` Angka kunci: ${p.stats.join(" · ")}.` : ` Key numbers: ${p.stats.join(" · ")}.`) : "";
      text = `${p.title} (${p.category}, ${p.year}): ${p.summary}${stats}`;
      lastProjectSlugs = [p.slug];
      actions = [caseStudy(p)];
      if (p.githubUrl) actions.push(action({ id: "Repo GitHub", en: "GitHub repo" }, p.githubUrl, lang, true));
      break;
    }
    case "project_technology": {
      const p = mentioned ?? k.projects.find((item) => item.slug === previous.lastProjectSlugs?.[0]);
      if (p) {
        text = lang === "id" ? `${p.title} dibangun dengan ${list(p.technologies, lang)}.` : `${p.title} is built with ${list(p.technologies, lang)}.`;
        lastProjectSlugs = [p.slug];
        actions = [caseStudy(p)];
      } else {
        text = lang === "id" ? "Sebutkan nama proyeknya agar saya bisa menjawab dengan tepat." : "Name the project so I can answer accurately.";
        actions = [workLink];
      }
      break;
    }
    case "skills":
    case "tech_stack":
      text = lang === "id"
        ? `Fokus Caesar: ${list(k.capabilities.map((c) => c.title), lang)}. Teknologi yang dipakai di proyeknya antara lain ${list(k.technologies.slice(0, 8), lang)}.`
        : `Caesar focuses on ${list(k.capabilities.map((c) => c.title), lang)}. Technologies used across his projects include ${list(k.technologies.slice(0, 8), lang)}.`;
      actions = [action({ id: "Lihat keahlian", en: "View capabilities" }, `${home}#capabilities`, lang)];
      break;
    case "frontend":
    case "backend":
    case "ai_data": {
      const group = usedTech(intent === "frontend" ? GROUPS.frontend : intent === "backend" ? GROUPS.backend : GROUPS.ai);
      const area: Bi = intent === "frontend" ? { id: "frontend", en: "frontend" } : intent === "backend" ? { id: "backend", en: "backend" } : { id: "AI dan data", en: "AI and data" };
      text = group.length
        ? lang === "id" ? `Untuk ${area.id}, proyek Caesar memakai ${list(group, lang)}.` : `For ${area.en}, Caesar's projects use ${list(group, lang)}.`
        : lang === "id" ? `Belum ada data ${area.id} yang tercatat di portofolio ini.` : `No ${area.en} details are listed in this portfolio yet.`;
      actions = [action({ id: "Lihat keahlian", en: "View capabilities" }, `${home}#capabilities`, lang)];
      break;
    }
    case "python": {
      const py = k.projects.filter((p) => p.technologies.some((t) => /python|tensorflow|pytorch|fastapi|opencv|yolo|whisper/i.test(t)));
      text = lang === "id"
        ? `Ya. Python dipakai di proyek seperti ${list(py.slice(0, 4).map((p) => p.title), lang)}.`
        : `Yes. Python powers projects such as ${list(py.slice(0, 4).map((p) => p.title), lang)}.`;
      actions = py.slice(0, 2).map(caseStudy);
      break;
    }
    case "experience":
      text = k.experience.length
        ? (lang === "id" ? "Pengalaman Caesar: " : "Caesar's experience: ") +
          k.experience.map((e) => [e.title, e.org, e.period].filter(Boolean).join(" · ")).join("; ") + "."
        : lang === "id" ? "Detail pengalaman belum dicantumkan di portofolio ini." : "Experience details aren't listed in this portfolio yet.";
      actions = [action({ id: "Lihat perjalanan", en: "View journey" }, `${home}#journey`, lang), linkedin];
      break;
    case "competitions":
      text = k.achievements.length
        ? (lang === "id" ? "Lomba yang diikuti Caesar: " : "Competitions Caesar joined: ") +
          k.achievements.map((a) => [a.title, a.period, a.org].filter(Boolean).join(" · ")).join("; ") + "."
        : lang === "id" ? "Detail lomba belum dicantumkan di portofolio ini." : "Competition details aren't listed in this portfolio yet.";
      actions = [action({ id: "Lihat perjalanan", en: "View journey" }, `${home}#journey`, lang)];
      break;
    case "github":
      text = lang === "id" ? "Repositori publik Caesar ada di GitHub." : "Caesar's public repositories are on GitHub.";
      actions = [github];
      break;
    case "linkedin":
      text = lang === "id" ? "Profil profesional Caesar ada di LinkedIn." : "Caesar's professional profile is on LinkedIn.";
      actions = [linkedin];
      break;
    case "contact":
      text = k.email
        ? lang === "id" ? `Hubungi Caesar lewat email ${k.email} atau LinkedIn.` : `Reach Caesar at ${k.email} or on LinkedIn.`
        : lang === "id" ? "Cara tercepat menghubungi Caesar adalah lewat LinkedIn." : "The fastest way to reach Caesar is LinkedIn.";
      actions = [linkedin, github];
      break;
    case "out_of_scope":
      text = lang === "id"
        ? "Saya hanya bisa menjawab seputar Caesar dan portofolionya. Untuk hal lain, silakan hubungi Caesar langsung di LinkedIn."
        : "I can only answer questions about Caesar and his portfolio. For anything else, reach out to Caesar on LinkedIn.";
      actions = [linkedin];
      break;
    default: {
      // "tidak tahu" tetap menawarkan jalan keluar: proyek terkait (bila ada teknologi yang disebut), GitHub, LinkedIn
      const tech = k.technologies.find((t) => normalized.includes(normalizeText(t)));
      const related = tech ? k.projects.filter((p) => p.technologies.includes(tech)) : [];
      text = related.length
        ? lang === "id"
          ? `Saya belum punya jawaban pasti, tapi ${tech} dipakai di ${list(related.map((p) => p.title), lang)}.`
          : `I don't have an exact answer, but ${tech} is used in ${list(related.map((p) => p.title), lang)}.`
        : lang === "id"
          ? "Saya belum punya informasi itu. Coba tanya soal proyek, keahlian, pengalaman, atau lihat langsung di GitHub dan LinkedIn."
          : "I don't have that information yet. Try asking about projects, skills, or experience, or check GitHub and LinkedIn.";
      actions = [...related.slice(0, 2).map(caseStudy), github, linkedin];
      if (related.length) lastProjectSlugs = related.map((p) => p.slug);
    }
  }

  return { text, intent, actions, context: { lastIntent: intent, lastProjectSlugs } };
}
