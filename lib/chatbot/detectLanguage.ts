import type { ChatLanguage } from "./types";
import { normalizeText } from "./normalizeText";

const indonesianWords = new Set([
  "apa", "aja", "siapa", "itu", "bisa", "pernah", "yang", "pertama", "pakai",
  "digunakan", "kuliah", "jurusan", "mahasiswa", "gimana", "bagaimana", "hubungi",
  "kontak", "mana", "tentang", "ceritakan", "tampilkan", "ada", "tidak", "dong",
  "paling", "untuk", "utama", "dia", "lihat", "aktivitas", "kontribusi", "teknologi",
  "project", "skill", "profil",
]);

const englishWords = new Set([
  "who", "what", "where", "how", "does", "did", "is", "are", "has", "have",
  "built", "build", "use", "uses", "study", "tell", "show", "his", "he", "first",
  "with", "about", "contact", "view", "work",
]);

export function detectLanguage(question: string): ChatLanguage {
  const words = normalizeText(question).split(" ");
  const idScore = words.reduce((score, word) => score + (indonesianWords.has(word) ? 1 : 0), 0);
  const enScore = words.reduce((score, word) => score + (englishWords.has(word) ? 1 : 0), 0);

  if (idScore > 0 || enScore > 0) return idScore >= enScore ? "id" : "en";
  return words.includes("caesar") ? "id" : "en";
}
