/**
 * Konfigurasi utama situs. Isi slot yang masih `null` di sini.
 * Semua teks bilingual memakai bentuk { id, en }.
 */
export type Locale = "id" | "en";
export const locales: Locale[] = ["id", "en"];
export const defaultLocale: Locale = "id";

export type L = { id: string; en: string };

export const site = {
  name: "Muhammad Caesar Aidarus",
  shortName: "Caesar Aidarus",
  initials: "CAE",
  location: "Banda Aceh, ID",
  timezone: "Asia/Jakarta",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** SLOT: letakkan file CV di /public/cv/ lalu isi path-nya, mis. "/cv/caesar-aidarus-cv.pdf" */
  cvUrl: null as string | null,

  /** SLOT: email kontak, mis. "halo@domain.com". Jika null, baris email disembunyikan. */
  email: null as string | null,

  /** SLOT: bio singkat. Jika null, tampil placeholder bergaris putus-putus. */
  bio: {
    id: "Mahasiswa Artificial Intelligence Universitas Syiah Kuala di program fast track S1–S2. Saya membangun sistem machine learning, dari computer vision hingga NLP berbasis LLM, beserta backend dan web yang menjalankannya. Terbuka untuk pekerjaan ML engineering dan freelance.",
    en: "AI undergraduate at Universitas Syiah Kuala on the fast-track bachelor's–master's program. I build machine learning systems, from computer vision to LLM-based NLP, and ship the backend and web code around them. Open to ML engineering and freelance work.",
  } as L | null,

  availableForWork: true,

  social: {
    github: "https://github.com/CaesarAidarus22",
    linkedin: "https://www.linkedin.com/in/muhammad-caesar-0767a7392/",
    instagram: "https://www.instagram.com/caesar._22/?hl=en",
    tiktok: "https://www.tiktok.com/@cae.nii",
    spotify: "https://open.spotify.com/user/317ztmmpiw6bxfldofoifg6bczne?si=3b8d545817f94804",
  },
};

export type SlotItem = { period: string; title: L; org: L; description?: L; highlight?: boolean };

const MONTHS = ["jan", "feb", "mar", "apr", "may|mei", "jun", "jul", "aug|agu", "sep", "oct|okt", "nov", "dec|des"];

/** Nilai urut dari akhir period ("Jan 2026 – Feb 2026" → Feb 2026). Hanya tahun = Desember; kosong = paling bawah. */
export function periodEnd(period: string) {
  const all = [...period.matchAll(/(?:([a-z]{3})[a-z]*\.?\s+)?(\d{4})/gi)];
  const last = all.at(-1);
  if (!last) return -Infinity;
  const m = last[1] ? MONTHS.findIndex((alts) => alts.split("|").includes(last[1].toLowerCase())) : 11;
  return Number(last[2]) * 12 + (m < 0 ? 11 : m);
}

/** Urutan tampil: item highlight paling atas, lalu yang terbaru. */
export const byRecent = (items: SlotItem[]) =>
  [...items].sort((a, b) => Number(!!b.highlight) - Number(!!a.highlight) || periodEnd(b.period) - periodEnd(a.period));

/** Pengalaman kerja/organisasi. Urutan tampil diatur byRecent(). */
export const experience: SlotItem[] = [
  {
    period: "Jan 2026 – Feb 2026",
    title: { id: "Backend Developer Intern", en: "Backend Developer Intern" },
    org: {
      id: "Badan Kepegawaian Aceh — Bidang Informasi Kepegawaian",
      en: "Badan Kepegawaian Aceh — Bidang Informasi Kepegawaian",
    },
    description: {
      id: "Merancang dan mengimplementasikan backend serta basis data Sistem Informasi KORPRI berbasis web dalam tim tiga orang (saya memegang backend, dua rekan mengerjakan frontend).",
      en: "Designed and implemented the backend and database of the KORPRI web information system in a three-person team (I owned the backend; two teammates handled the frontend).",
    },
  },
  {
    period: "Jul 2026 – Aug 2026",
    title: { id: "Ketua Kelompok KKN", en: "KKN Group Leader" },
    org: { id: "Universitas Syiah Kuala — KKN LT 69", en: "Universitas Syiah Kuala — KKN LT 69" },
    description: {
      id: "Memimpin kelompok KKN LT 69 sebagai ketua dan mengoordinasikan program kerja kelompok bersama masyarakat.",
      en: "Led KKN LT 69 as group leader, coordinating the team's community work programme.",
    },
  },
];

/** Lomba & prestasi. org dipakai untuk hasil/peran; highlight = disorot di Journey. */
export const achievements: SlotItem[] = [
  {
    period: "2026",
    title: {
      id: "Data Slayer 4.0 — Machine Learning Competition (Kaggle)",
      en: "Data Slayer 4.0 — Machine Learning Competition (Kaggle)",
    },
    org: {
      id: "Peserta · Berkontribusi dalam tim",
      en: "Participant · Team contributor",
    },
    description: {
      id: "Deteksi kecurangan ujian dari video (klasifikasi biner, Macro-F1). Membangun pipeline klasifikasi video dengan PyTorch untuk submission tim.",
      en: "Exam cheating detection from video (binary classification, Macro-F1). Built a PyTorch video classification pipeline for the team's submissions.",
    },
  },
  {
    period: "2026",
    title: {
      id: "UI/UX Competition — MANIFEST 2026 (HMMI USK)",
      en: "UI/UX Competition — MANIFEST 2026 (HMMI USK)",
    },
    org: { id: "Ketua Tim", en: "Team Lead" },
    highlight: true,
    description: {
      id: "Memimpin tim ApapunSelainSkripsi merancang Meukat, platform pemulihan dan penggunaan ulang material bangunan sebelum pembongkaran (SDGs 11.6).",
      en: "Led team ApapunSelainSkripsi in designing Meukat, a platform for recovering and reusing construction materials before demolition (SDG 11.6).",
    },
  },
];
