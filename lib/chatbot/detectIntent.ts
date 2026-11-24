import type { ChatIntent } from "./types";
import { normalizeText } from "./normalizeText";

type IntentDefinition = {
  intent: ChatIntent;
  phrases: string[];
  keywords: string[];
};

// Diport dari v1; ditambah intent pengalaman & lomba, intent aktivitas GitHub dihapus (widget-nya tidak ada di v2).
const definitions: IntentDefinition[] = [
  { intent: "ai_projects", phrases: ["project ai", "ai project", "machine learning project", "proyek ai", "bikin ai", "built with ai", "his ai projects"], keywords: ["ai", "machine learning", "deep learning"] },
  { intent: "education", phrases: ["kuliah di mana", "jurusan caesar", "mahasiswa apa", "where does caesar study", "what does caesar study", "caesar s major"], keywords: ["kuliah", "jurusan", "mahasiswa", "study", "studies", "major", "university", "universitas", "education", "pendidikan"] },
  { intent: "identity", phrases: ["siapa caesar", "caesar itu siapa", "ceritakan tentang caesar", "pemilik portfolio", "who is caesar", "tell me about caesar", "who owns this portfolio", "tell me about yourself"], keywords: ["siapa", "who owns", "tentang caesar", "about caesar"] },
  { intent: "experience", phrases: ["pengalaman kerja", "pernah kerja", "pernah magang", "work experience", "where has he worked", "internship"], keywords: ["pengalaman", "experience", "magang", "intern", "kerja", "worked", "kkn"] },
  { intent: "competitions", phrases: ["ikut lomba", "pernah lomba", "kompetisi apa", "competitions", "hackathon", "kaggle"], keywords: ["lomba", "kompetisi", "competition", "prestasi", "award", "juara", "kaggle"] },
  { intent: "frontend", phrases: ["frontend pakai apa", "frontend biasa pakai", "use for frontend", "uses for frontend"], keywords: ["frontend", "front end", "antarmuka"] },
  { intent: "backend", phrases: ["backend pakai apa", "use for backend", "uses for backend"], keywords: ["backend", "back end", "server stack", "database"] },
  { intent: "python", phrases: ["bisa python", "pakai python", "use python", "uses python"], keywords: ["python"] },
  { intent: "ai_data", phrases: ["untuk ai", "use for ai", "data mining", "bisa data mining", "work with data mining"], keywords: ["data mining", "untuk ai", "for ai"] },
  { intent: "tech_stack", phrases: ["tech stack", "bahasa pemrograman", "teknologi apa", "programming languages", "technologies does", "technologies he"], keywords: ["tech", "teknologi", "technology", "technologies", "programming language", "bahasa pemrograman", "stack"] },
  { intent: "skills", phrases: ["skill utama", "main skills", "bisa apa", "keahlian caesar", "kemampuan caesar"], keywords: ["skill", "skills", "keahlian", "kemampuan"] },
  { intent: "projects", phrases: ["project caesar", "project apa", "pernah dibuat", "tampilkan project", "what projects", "what has caesar built", "show me caesar s projects", "what does caesar build"], keywords: ["project", "projects", "proyek", "built", "dibuat", "portofolio"] },
  { intent: "linkedin", phrases: ["linkedin caesar", "where is linkedin", "find caesar on linkedin"], keywords: ["linkedin"] },
  { intent: "contact", phrases: ["cara hubungi", "hubungi caesar", "kontaknya", "contact caesar", "how can i contact", "email caesar"], keywords: ["kontak", "hubungi", "contact", "email", "reach", "hire", "freelance"] },
  { intent: "github", phrases: ["github caesar", "githubnya mana", "open caesar s github", "where is his github", "what is caesar s github"], keywords: ["github", "repository", "repo", "repositori"] },
];

const outOfScope = ["presiden", "bitcoin", "homework", "pekerjaan rumah", "cuaca", "weather", "resep", "recipe", "gaji", "salary", "pacar", "girlfriend", "alamat rumah", "home address"];

export function detectIntent(question: string): ChatIntent {
  const normalized = normalizeText(question);
  if (outOfScope.some((term) => normalized.includes(term))) return "out_of_scope";

  let best: { intent: ChatIntent; score: number } | null = null;
  for (const [order, definition] of definitions.entries()) {
    let score = 0;
    for (const phrase of definition.phrases) {
      if (normalized.includes(normalizeText(phrase))) score = Math.max(score, 100 + phrase.split(" ").length);
    }
    for (const keyword of definition.keywords) {
      // cocokkan sebagai kata utuh agar "ai" tidak cocok dengan "pakai"
      if (new RegExp(`(^| )${normalizeText(keyword)}( |$)`).test(normalized)) score += 12;
    }
    score += score > 0 ? (definitions.length - order) * 0.01 : 0;
    if (score >= 12 && (!best || score > best.score)) best = { intent: definition.intent, score };
  }
  return best?.intent ?? "unknown";
}
