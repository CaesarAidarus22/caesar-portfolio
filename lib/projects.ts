import type { L } from "./site";

export type Project = {
  slug: string;
  number: string;
  title: string;
  category: L;
  year: string;
  role?: L;
  summary: L;
  technologies: string[];
  githubUrl?: string;
  image?: string;
  /** warna latar kartu preview */
  tone: "brand" | "brandDeep" | "ink" | "blush";
  stats?: Array<{ value: string; label?: L }>;
  problem?: L;
  solution?: L;
  architecture?: L[];
  features?: L[];
  challenges?: L[];
  results?: L;
  lessons?: L;
  status?: L;
};

const entries: Array<Omit<Project, "number">> = [
  {
    slug: "smart-insect-identifier",
    title: "Smart Insect Identifier",
    category: { id: "AI Vision", en: "AI Vision" },
    year: "2026",
    role: { id: "Student Developer", en: "Student Developer" },
    summary: {
      id: "Klasifikasi 118 kelas serangga dengan EfficientNetB0, dilengkapi konteks ekologis dari Gemini AI.",
      en: "118-class insect classifier built on EfficientNetB0, enriched with ecological context from Gemini AI.",
    },
    technologies: ["TensorFlow", "EfficientNetB0", "FastAPI", "React", "Gemini AI"],
    githubUrl: "https://github.com/CaesarAidarus22/smart-insect-identifier",
    image: "/images/smart-insect-laptop.jpg",
    tone: "ink",
    stats: [
      { value: "118", label: { id: "Kelas", en: "Classes" } },
      { value: "73.97%", label: { id: "Akurasi uji", en: "Test accuracy" } },
      { value: "50", label: { id: "Layer di-fine-tune", en: "Layers fine-tuned" } },
    ],
    problem: {
      id: "Output image classification sulit dipahami jika hanya berupa label. Sistem perlu mengenali dataset serangga yang luas sekaligus memberi konteks yang berguna bagi pengguna.",
      en: "A bare class label is hard for users to act on. The system had to recognise a wide insect dataset and still explain what it found.",
    },
    solution: {
      id: "Antarmuka React mengirim gambar ke inference service FastAPI. EfficientNetB0 menghasilkan kelas, confidence, dan alternatif prediksi; Gemini menambahkan taksonomi, habitat, dan konteks ekologis dengan local fallback saat API tidak tersedia.",
      en: "A React upload flow sends images to a FastAPI inference service. EfficientNetB0 returns the class, confidence and alternatives; Gemini adds taxonomy, habitat and ecological context, with a local fallback when the API is unavailable.",
    },
    architecture: [
      { id: "Antarmuka upload dan preview berbasis React", en: "React upload and preview interface" },
      { id: "Preprocessing gambar dan inference API dengan FastAPI", en: "Image preprocessing and inference API in FastAPI" },
      { id: "Model transfer learning EfficientNetB0", en: "EfficientNetB0 transfer-learning model" },
      { id: "Layanan insight ekologis Gemini dengan fallback", en: "Gemini ecological-insight service with fallback" },
    ],
    challenges: [
      { id: "Menjaga inference model dan generative insight tetap berguna secara terpisah", en: "Keeping model inference and generative insight useful independently" },
      { id: "Menyajikan confidence dan alternatif prediksi dengan jelas", en: "Presenting confidence and alternative predictions clearly" },
      { id: "Menangani Gemini yang tidak tersedia atau terkena rate limit tanpa mengganggu klasifikasi", en: "Handling Gemini outages and rate limits without breaking classification" },
    ],
    results: {
      id: "Test accuracy 73,97% pada 118 kelas serangga dengan EfficientNetB0 yang di-fine-tune pada 50 layer terakhir.",
      en: "73.97% test accuracy across 118 insect classes, fine-tuning the last 50 layers of EfficientNetB0.",
    },
    lessons: {
      id: "Produk AI yang andal butuh lebih dari model. Preprocessing, batas antar-API, fallback, dan output yang mudah dipahami sama-sama membentuk pengalaman pengguna.",
      en: "A reliable AI product needs more than a model. Preprocessing, API boundaries, fallbacks and readable output shape the experience just as much.",
    },
  },
  {
    slug: "sahamradar",
    title: "SahamRadar",
    category: { id: "Market Intelligence", en: "Market Intelligence" },
    year: "2026",
    summary: {
      id: "Platform yang menggabungkan berita, sentimen, ticker, dan AI insight untuk membaca pasar saham Indonesia.",
      en: "A platform combining news, sentiment, tickers and AI insight to read the Indonesian stock market.",
    },
    technologies: ["AI", "Sentiment Analysis", "Market Data"],
    image: "/images/sahamradar-mockup.png",
    tone: "brand",
    problem: {
      id: "Informasi yang memengaruhi pasar tersebar di banyak sumber. Pengguna harus menghubungkan berita, ticker, dan sentimen secara manual.",
      en: "Market-moving information is scattered across sources. Users had to connect news, tickers and sentiment by hand.",
    },
    solution: {
      id: "Berita pasar, kecenderungan sentimen, konteks ticker, dan ringkasan AI disatukan dalam satu dashboard sehingga sinyal pasar terbaca sebagai konteks yang saling terhubung.",
      en: "Market news, sentiment, ticker context and AI summaries live in one dashboard, so signals read as connected context.",
    },
    architecture: [
      { id: "Berita dan informasi pasar dikumpulkan sebagai konteks utama", en: "News and market data collected as primary context" },
      { id: "Informasi dikelompokkan bersama sentimen dan ticker yang relevan", en: "Items grouped with relevant sentiment and tickers" },
      { id: "AI merangkum sinyal utama menjadi insight ringkas", en: "AI condenses key signals into short insights" },
      { id: "Dashboard menyajikan semuanya dalam satu alur baca", en: "Dashboard presents everything in one reading flow" },
    ],
    challenges: [
      { id: "Menyatukan banyak jenis informasi tanpa membuat dashboard padat", en: "Combining many data types without a cluttered dashboard" },
      { id: "Menjaga hierarki antara berita, sentimen, ticker, dan ringkasan AI", en: "Keeping hierarchy between news, sentiment, tickers and AI summaries" },
    ],
    lessons: {
      id: "Produk data butuh hierarki informasi yang sama kuatnya dengan proses analisisnya.",
      en: "A data product needs information hierarchy as strong as its analysis.",
    },
  },
  {
    slug: "nlp-speech-pipeline",
    title: "Code-Switching Speech Pipeline",
    category: { id: "NLP & Speech", en: "NLP & Speech" },
    year: "2026",
    role: { id: "Student Developer", en: "Student Developer" },
    summary: {
      id: "Pipeline end-to-end untuk audio campur bahasa: transkripsi, normalisasi, language tagging, respons, hingga suara.",
      en: "End-to-end pipeline for mixed-language audio: transcription, normalisation, language tagging, response and speech.",
    },
    technologies: ["Whisper", "Node.js", "Gemini", "Text-to-Speech", "NLP"],
    githubUrl: "https://github.com/CaesarAidarus22/UAS-Prak_NLP_M.CaesarAidarus_2372",
    tone: "blush",
    problem: {
      id: "Speech code-switching butuh beberapa tahap yang bekerja bersama: transkripsi, pembersihan teks, kesadaran bahasa, pembuatan respons, dan sintesis suara.",
      en: "Code-switched speech needs several stages working together: transcription, text cleanup, language awareness, response generation and speech synthesis.",
    },
    solution: {
      id: "Seluruh tahap disusun menjadi pipeline yang dapat dikonfigurasi: speech-to-text Whisper, language tagging, integrasi Gemini dengan fallback, dan output text-to-speech.",
      en: "All stages form a configurable pipeline: Whisper speech-to-text, language tagging, Gemini with a fallback generator, and text-to-speech output.",
    },
    architecture: [
      { id: "Input audio dan speech-to-text dengan Whisper", en: "Audio input and Whisper speech-to-text" },
      { id: "Normalisasi teks dan language tagging", en: "Text normalisation and language tagging" },
      { id: "Pembuatan respons Gemini dengan local fallback", en: "Gemini response generation with local fallback" },
      { id: "Output audio text-to-speech", en: "Text-to-speech audio output" },
    ],
    results: {
      id: "Repository menyertakan output eksperimen dan ringkasan korpus sehingga perilaku pipeline bisa diperiksa, bukan diperlakukan sebagai black box.",
      en: "The repo ships experiment output and a corpus summary, so the pipeline can be inspected rather than treated as a black box.",
    },
    lessons: {
      id: "Tahapan eksplisit dan fallback yang dapat diganti membuat sistem NLP end-to-end lebih terukur.",
      en: "Explicit stages and swappable fallbacks make an end-to-end NLP system measurable.",
    },
  },
  {
    slug: "yolo-queue-detection",
    title: "YOLO Queue Detection",
    category: { id: "Computer Vision", en: "Computer Vision" },
    year: "2025",
    role: { id: "Student Developer", en: "Student Developer" },
    summary: {
      id: "Mendeteksi dan menghitung orang di antrean, lalu mengklasifikasikan kepadatannya: sepi, sedang, atau padat.",
      en: "Detects and counts people in a queue, then labels its density: quiet, moderate or crowded.",
    },
    technologies: ["Python", "OpenCV", "YOLOv3-tiny"],
    githubUrl:
      "https://github.com/CaesarAidarus22/UAS-Viskom-M.Caesar-Aidarus-2308107010072-Deteksi-Orang-Dalam-Antrian",
    tone: "brandDeep",
    problem: {
      id: "Memperkirakan kepadatan antrean dari gambar diam butuh deteksi orang yang andal sekaligus menekan false positive.",
      en: "Estimating queue density from still images needs reliable person detection while suppressing false positives.",
    },
    solution: {
      id: "Preprocessing gambar, inference YOLOv3-tiny lewat OpenCV DNN, non-maximum suppression dan heuristic filtering, lalu output jumlah orang serta kategori kepadatan.",
      en: "Image preprocessing, YOLOv3-tiny inference through OpenCV DNN, non-maximum suppression and heuristic filtering, then person count and density label.",
    },
    challenges: [
      { id: "Occlusion antarorang dalam antrean padat", en: "Occlusion between people in dense queues" },
      { id: "Subjek kecil pada gambar lebar", en: "Small subjects in wide images" },
      { id: "Menekan false positive dengan detector ringan", en: "Reducing false positives with a lightweight detector" },
    ],
    lessons: {
      id: "Pemilihan model dan post-processing adalah tawar-menawar antara akurasi dan kecepatan.",
      en: "Model choice and post-processing are a trade-off between accuracy and speed.",
    },
  },
  {
    slug: "campusfind",
    title: "CampusFind",
    category: { id: "Full-stack", en: "Full-stack" },
    year: "2026",
    summary: {
      id: "Platform lost-and-found kampus dengan moderasi admin, pencarian, dan pencocokan barang otomatis berbasis aturan.",
      en: "Campus lost-and-found platform with admin moderation, search and rule-based item matching.",
    },
    technologies: ["React", "Express", "Supabase", "PostgreSQL", "JWT"],
    githubUrl: "https://github.com/CaesarAidarus22/CampusFind",
    image: "/images/campusfind-laptop.jpg",
    tone: "ink",
    problem: {
      id: "Laporan barang hilang tersebar di chat dan media sosial. Mahasiswa butuh laporan yang bisa dicari; moderator perlu mengontrol yang tampil ke publik.",
      en: "Lost-item reports scatter across chats and social posts. Students need searchable reports; moderators need control over what goes public.",
    },
    solution: {
      id: "Pelaporan terautentikasi, upload gambar, pencarian publik, status moderasi, notifikasi, dan layanan potential-match dalam satu workflow full-stack.",
      en: "Authenticated reporting, image upload, public search, moderation states, notifications and a potential-match service in one full-stack workflow.",
    },
    challenges: [
      { id: "Menjaga laporan pending/rejected tidak masuk hasil publik", en: "Keeping pending/rejected reports out of public results" },
      { id: "Memisahkan permission pengguna dan admin di seluruh API", en: "Separating user and admin permissions across the API" },
    ],
    lessons: {
      id: "Perubahan status adalah bagian dari arsitektur produk; memodelkannya secara eksplisit memudahkan authorization dan notifikasi.",
      en: "State transitions are product architecture; modelling them explicitly simplifies authorization and notifications.",
    },
  },
  {
    slug: "gabutbot",
    title: "GabutBot",
    category: { id: "Chatbot", en: "Chatbot" },
    year: "2026",
    summary: {
      id: "Chatbot rekomendasi berbasis mood yang mengubah waktu luang menjadi aktivitas yang relevan.",
      en: "Mood-based recommendation chatbot that turns idle time into relevant activities.",
    },
    technologies: ["React", "Recommendation Engine", "Chatbot Logic"],
    image: "/images/gabutbot-laptop.jpg",
    tone: "blush",
    status: {
      id: "Dokumentasi teknis lengkap sedang disiapkan.",
      en: "Full technical write-up in progress.",
    },
  },
  {
    slug: "nubofind",
    title: "NuboFind",
    category: { id: "Information Retrieval", en: "Information Retrieval" },
    year: "2025",
    summary: {
      id: "Proyek information retrieval bertema olahraga: search, indexing, dan penemuan data terstruktur.",
      en: "Sports-themed information retrieval project exploring search, indexing and structured data discovery.",
    },
    technologies: ["Information Retrieval", "Search", "Data Processing"],
    githubUrl: "https://github.com/CaesarAidarus22/Project-Penelusuran-Informasi-kel14",
    tone: "ink",
    status: {
      id: "Repository publik tersedia; dokumentasi lengkap menyusul.",
      en: "Public repository available; full documentation coming soon.",
    },
  },
];

export const projects: Project[] = entries.map((p, i) => ({
  ...p,
  number: String(i + 1).padStart(2, "0"),
}));

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
