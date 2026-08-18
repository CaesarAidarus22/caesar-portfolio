import { portfolioFacts } from "@/app/data/portfolioKnowledge";
import { detectIntent } from "./detectIntent";
import { detectLanguage } from "./detectLanguage";
import type { ChatAction, ChatContext, ChatLanguage, ChatLanguageMode, ChatResponse } from "./types";

function list(items: readonly string[], language: ChatLanguage) {
  if (items.length < 2) return items[0] ?? "";
  const conjunction = language === "id" ? "dan" : "and";
  return `${items.slice(0, -1).join(", ")}, ${conjunction} ${items.at(-1)}`;
}

function action(label: Record<ChatLanguage, string>, href: string, language: ChatLanguage, external = false): ChatAction {
  return { label: label[language], href, external };
}

export function generateResponse(question: string, mode: ChatLanguageMode = "auto", previousContext: ChatContext = {}): ChatResponse {
  const language = mode === "auto" ? detectLanguage(question) : mode;
  const intent = detectIntent(question, previousContext);
  const facts = portfolioFacts;
  const allProjectNames = facts.projects.map((project) => project.shortTitle);
  const aiProjects = facts.aiProjectSlugs
    .map((slug) => facts.projects.find((project) => project.slug === slug))
    .filter((project): project is (typeof facts.projects)[number] => Boolean(project));
  let text = "";
  let actions: ChatAction[] = [];
  let lastProjectSlugs = previousContext.lastProjectSlugs;
  const program = language === "id" ? facts.person.program : "Informatics";
  const institution = language === "id" ? facts.person.institution : "Syiah Kuala University";

  switch (intent) {
    case "identity":
      text = language === "id"
        ? `${facts.person.name} adalah mahasiswa ${program} di ${institution}. Ia berfokus pada Software Engineering, AI, Data Mining, NLP, dan Computer Vision.`
        : `${facts.person.name} studies ${program} at ${institution}. He focuses on Software Engineering, AI, Data Mining, NLP, and Computer Vision.`;
      actions = [action({ id: "Tentang Caesar", en: "About Caesar" }, "/about", language)];
      break;
    case "education":
      text = language === "id" ? `Caesar adalah mahasiswa ${program} di ${institution}.` : `Caesar studies ${program} at ${institution}.`;
      actions = [action({ id: "Tentang Caesar", en: "About Caesar" }, "/about", language)];
      break;
    case "projects":
      text = language === "id"
        ? `Caesar membangun project di bidang AI, web development, NLP, Computer Vision, dan data/search. Project yang ditampilkan adalah ${list(allProjectNames, language)}.`
        : `Caesar builds across AI, web development, NLP, Computer Vision, and data/search systems. The featured work includes ${list(allProjectNames, language)}.`;
      lastProjectSlugs = facts.projects.map((project) => project.slug);
      actions = [action({ id: "Lihat Projects", en: "View Projects" }, "/#projects", language)];
      break;
    case "ai_projects":
      text = language === "id" ? `Project AI Caesar mencakup ${list(aiProjects.map((project) => project.shortTitle), language)}.` : `Caesar's AI projects include ${list(aiProjects.map((project) => project.shortTitle), language)}.`;
      lastProjectSlugs = aiProjects.map((project) => project.slug);
      actions = [action({ id: "Lihat Projects", en: "View Projects" }, "/#projects", language)];
      break;
    case "skills":
    case "tech_stack":
      text = language === "id"
        ? "Area utamanya adalah Full Stack Development, Machine Learning, Data Mining, NLP, dan Computer Vision. Tech stack yang sering digunakan mencakup React, Next.js, Python, FastAPI, TensorFlow, dan Supabase."
        : "His main areas are Full Stack Development, Machine Learning, Data Mining, NLP, and Computer Vision. His stack includes React, Next.js, Python, FastAPI, TensorFlow, and Supabase.";
      actions = [action({ id: "Lihat Tech Stack", en: "View Tech Stack" }, "/#tech-stack", language)];
      break;
    case "frontend":
      text = language === "id" ? `Untuk Frontend, Caesar menggunakan ${list(facts.skills.frontend, language)}.` : `For Frontend work, Caesar uses ${list(facts.skills.frontend, language)}.`;
      break;
    case "backend":
      text = language === "id" ? `Untuk Backend, Caesar menggunakan ${list(facts.skills.backend, language)}, dengan PostgreSQL atau Supabase untuk data.` : `For Backend work, Caesar uses ${list(facts.skills.backend, language)}, with PostgreSQL or Supabase for data.`;
      break;
    case "ai_data":
      text = language === "id" ? `Untuk AI dan data, Caesar menggunakan ${list([...facts.skills.ai, ...facts.skills.data.slice(0, 2)], language)}.` : `For AI and data work, Caesar uses ${list([...facts.skills.ai, ...facts.skills.data.slice(0, 2)], language)}.`;
      break;
    case "python":
      text = language === "id" ? "Ya. Caesar menggunakan Python untuk Machine Learning, NLP, pengolahan data, FastAPI, OpenCV, dan Computer Vision berbasis YOLO." : "Yes. Caesar uses Python for Machine Learning, NLP, data processing, FastAPI, OpenCV, and YOLO-based Computer Vision.";
      break;
    case "github_activity":
      text = language === "id" ? "Bagian GitHub Activity memuat kalender kontribusi asli Caesar serta ringkasan active days dan streak saat API tersedia." : "The GitHub Activity section loads Caesar's real contribution calendar, active days, and streaks when the API is available.";
      actions = [action({ id: "Lihat GitHub Activity", en: "View GitHub Activity" }, "/#github-activity", language)];
      break;
    case "github":
      text = language === "id" ? "Profil GitHub Caesar berisi repository dan project yang dapat diakses publik." : "Caesar's GitHub profile contains his public repositories and project work.";
      actions = [action({ id: "Buka GitHub", en: "Open GitHub" }, facts.social.github, language, true)];
      break;
    case "linkedin":
      text = language === "id" ? "Kamu dapat menemukan profil profesional Caesar di LinkedIn." : "You can find Caesar's professional profile on LinkedIn.";
      actions = [action({ id: "Buka LinkedIn", en: "Open LinkedIn" }, facts.social.linkedin, language, true)];
      break;
    case "contact":
      text = language === "id" ? "Caesar dapat dihubungi melalui LinkedIn atau GitHub. Belum ada alamat email terverifikasi yang ditampilkan di portfolio ini." : "You can contact Caesar through LinkedIn or GitHub. No verified email address is currently shown on this portfolio.";
      actions = [action({ id: "Buka LinkedIn", en: "Open LinkedIn" }, facts.social.linkedin, language, true), action({ id: "Buka GitHub", en: "Open GitHub" }, facts.social.github, language, true)];
      break;
    case "project_technology": {
      const project = facts.projects.find((item) => item.slug === previousContext.lastProjectSlugs?.[0]);
      text = project
        ? language === "id" ? `${project.shortTitle} menggunakan ${list(project.technologies, language)}.` : `${project.shortTitle} uses ${list(project.technologies, language)}.`
        : language === "id" ? "Sebutkan project yang ingin kamu tanyakan agar saya dapat menjawab dengan tepat." : "Name the project you mean so I can answer accurately.";
      if (project) actions = [action({ id: "Buka Case Study", en: "Open Case Study" }, `/projects/${project.slug}`, language)];
      break;
    }
    case "out_of_scope":
      text = language === "id" ? "Saya khusus membantu menjawab pertanyaan tentang Caesar dan portfolio ini." : "I'm specifically here to answer questions about Caesar and this portfolio.";
      break;
    default:
      text = language === "id" ? "Saya belum punya informasi yang dapat dipercaya tentang itu. Kamu bisa bertanya tentang project, skill, pendidikan, GitHub, atau cara menghubungi Caesar." : "I don't have reliable information about that yet. You can ask me about Caesar's projects, skills, education, GitHub, or contact information.";
  }

  return { text, language, intent, actions, context: { lastIntent: intent, lastProjectSlugs } };
}
