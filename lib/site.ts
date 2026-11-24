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
  initials: "CA",
  location: "Banda Aceh, ID",
  timezone: "Asia/Jakarta",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** SLOT: letakkan file CV di /public/cv/ lalu isi path-nya, mis. "/cv/caesar-aidarus-cv.pdf" */
  cvUrl: null as string | null,

  /** SLOT: email kontak, mis. "halo@domain.com". Jika null, baris email disembunyikan. */
  email: null as string | null,

  /** SLOT: bio singkat. Jika null, tampil placeholder bergaris putus-putus. */
  bio: null as L | null,

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
export const experience: SlotItem[] = [];

/** SLOT: lomba & prestasi. Kosong = tampil kartu placeholder. */
export const achievements: SlotItem[] = [];
