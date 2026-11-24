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

export type SlotItem = { period: string; title: L; org: L; description?: L };

/** SLOT: pengalaman kerja/organisasi. Kosong = tampil kartu placeholder. */
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
    period: "TODO",
    title: { id: "Peserta KKN", en: "Community Service Participant (KKN)" },
    org: { id: "Universitas Syiah Kuala — KKN LT 69", en: "Universitas Syiah Kuala — KKN LT 69" },
    description: { id: "TODO: kontribusi konkret", en: "TODO: concrete contribution" },
  },
];

/** SLOT: lomba & prestasi. Kosong = tampil kartu placeholder. */
// org dipakai untuk hasil/peran karena skema tidak punya field khusus
export const achievements: SlotItem[] = [
  {
    period: "2026",
    title: {
      id: "Data Slayer 4.0 — Machine Learning Competition (Kaggle)",
      en: "Data Slayer 4.0 — Machine Learning Competition (Kaggle)",
    },
    org: {
      id: "Peserta (TODO: perbarui setelah final private leaderboard)",
      en: "Participant (TODO: update after final private leaderboard)",
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
    org: {
      id: "Ketua Tim (TODO: tambahkan peringkat jika ada)",
      en: "Team Lead (TODO: add placement if any)",
    },
    description: {
      id: "Memimpin tim ApapunSelainSkripsi merancang Meukat, platform pemulihan dan penggunaan ulang material bangunan sebelum pembongkaran (SDGs 11.6).",
      en: "Led team ApapunSelainSkripsi in designing Meukat, a platform for recovering and reusing construction materials before demolition (SDG 11.6).",
    },
  },
];
