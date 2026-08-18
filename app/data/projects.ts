export type ProjectAccent = "green" | "beige" | "blue" | "slate" | "purple" | "amber";

export type Project = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  summary: string;
  description?: string;
  role?: string;
  year?: string;
  technologies: string[];
  githubUrl?: string;
  heroImage?: string;
  problem?: string;
  solution?: string;
  architecture?: string[];
  features?: string[];
  challenges?: string[];
  results?: string;
  lessons?: string;
  accent: ProjectAccent;
  accentColor: string;
  status?: string;
  featured?: boolean;
  stats?: Array<{ value: string; label?: string }>;
};

export const projects: Project[] = [
  {
    slug: "smart-insect-identifier",
    number: "01",
    title: "Smart Insect Identifier & AI Insights",
    shortTitle: "Smart Insect Identifier",
    category: "AI Vision Platform",
    summary:
      "Sistem klasifikasi serangga yang menggabungkan prediksi EfficientNetB0 dengan konteks ekologis ringkas dari Gemini AI.",
    description:
      "Dibangun sebagai final project Praktikum Machine Learning, aplikasi ini mengubah gambar serangga menjadi ranked predictions dan informasi ekologis yang mudah dipahami.",
    role: "Student Developer",
    year: "2026",
    technologies: ["TensorFlow", "EfficientNetB0", "FastAPI", "React", "Gemini AI"],
    githubUrl: "https://github.com/CaesarAidarus22/smart-insect-identifier",
    heroImage: "/images/smart-insect-laptop.jpg",
    problem:
      "Output image classification sulit dipahami jika hanya berupa label. Sistem ini perlu mengenali dataset serangga yang luas sekaligus memberi konteks yang berguna bagi pengguna.",
    solution:
      "Alur upload berbasis React mengirim gambar ke inference service FastAPI. EfficientNetB0 menghasilkan kelas, confidence, dan alternatif prediksi; Gemini kemudian menambahkan taksonomi, habitat, dan konteks ekologis dengan local fallback saat API tidak tersedia.",
    architecture: [
      "Interface upload dan preview berbasis React",
      "Image preprocessing dan inference API dengan FastAPI",
      "Model transfer learning EfficientNetB0",
      "Gemini ecological insight service dengan fallback",
    ],
    features: [
      "Upload dan preview gambar",
      "Visualisasi top prediction",
      "Ecological insights dari AI",
      "Gemini fallback mode yang tetap informatif",
    ],
    challenges: [
      "Menjaga model inference dan generative insights tetap berguna secara terpisah",
      "Menyajikan confidence dan alternatif prediksi dengan jelas",
      "Menangani akses Gemini yang tidak tersedia atau terkena rate limit tanpa mengganggu proses klasifikasi",
    ],
    results:
      "Evaluasi yang terdokumentasi mencatat test accuracy 73,97% pada 118 kelas serangga menggunakan EfficientNetB0 yang di-fine-tune pada 50 layer terakhir.",
    lessons:
      "Produk AI yang andal membutuhkan lebih dari sekadar model. Preprocessing, batas antar-API, fallback behavior, dan output yang mudah dipahami sama-sama membentuk pengalaman pengguna.",
    accent: "green",
    accentColor: "#4f9a72",
    featured: true,
    stats: [
      { value: "118", label: "Classes" },
      { value: "73.97%", label: "Test accuracy" },
      { value: "TensorFlow + FastAPI" },
    ],
  },
  {
    slug: "campusfind",
    number: "02",
    title: "CampusFind",
    shortTitle: "CampusFind",
    category: "Campus Lost & Found",
    summary:
      "Platform lost-and-found full-stack untuk membuat laporan, melakukan moderasi, mencari, dan mencocokkan barang di lingkungan kampus.",
    description:
      "CampusFind memberi mahasiswa satu alur terorganisir untuk laporan kehilangan dan penemuan, dengan publikasi serta potential matches tetap berada dalam moderasi admin.",
    year: "2026",
    technologies: ["React", "Express", "Supabase", "PostgreSQL", "JWT"],
    githubUrl: "https://github.com/CaesarAidarus22/CampusFind",
    heroImage: "/images/campusfind-laptop.jpg",
    problem:
      "Laporan barang hilang di kampus mudah tersebar di berbagai chat dan unggahan sosial. Mahasiswa membutuhkan laporan yang dapat dicari, sementara moderator perlu mengontrol informasi yang tampil ke publik.",
    solution:
      "CampusFind menyatukan authenticated reporting, image upload, public search, status moderasi, notifikasi, dan rule-based potential-match service dalam satu workflow full-stack.",
    architecture: [
      "Client berbasis React dan Vite",
      "Express REST API dengan autentikasi JWT",
      "Data store Supabase PostgreSQL",
      "Service untuk moderasi, notifikasi, dan matching",
    ],
    features: [
      "Workflow laporan kehilangan dan penemuan",
      "Approval dan rejection oleh admin",
      "Pencarian dan multi-field filtering",
      "Notifikasi potential match",
    ],
    challenges: [
      "Menjaga laporan pending dan rejected agar tidak masuk ke hasil publik",
      "Mengoordinasikan moderasi laporan dengan proses matching dan notifikasi",
      "Memisahkan permission pengguna dan admin di seluruh API",
    ],
    results:
      "Repository mendokumentasikan alur end-to-end yang bekerja, mulai dari authenticated report submission hingga moderasi, public discovery, dan notifikasi potential match.",
    lessons:
      "Perubahan status merupakan bagian dari arsitektur produk. Memodelkannya secara eksplisit membuat authorization, visibility, dan notifikasi lebih mudah dipahami serta dikelola.",
    accent: "beige",
    accentColor: "#b7a78b",
    featured: true,
    stats: [
      { value: "Lost & Found Platform" },
      { value: "Supabase Backend" },
      { value: "Admin Moderation" },
    ],
  },
  {
    slug: "gabutbot",
    number: "03",
    title: "GabutBot",
    shortTitle: "GabutBot",
    category: "Recommendation Chatbot",
    summary:
      "Chatbot rekomendasi berbasis mood yang mengubah waktu luang menjadi aktivitas relevan dan langkah berikutnya yang lebih produktif.",
    technologies: ["React", "Recommendation Engine", "Chatbot Logic"],
    heroImage: "/images/gabutbot-laptop.jpg",
    features: ["Prompt berbasis mood", "Rule-based recommendations", "Conversational interface"],
    accent: "blue",
    accentColor: "#668bc6",
    status: "Dokumentasi teknis yang lebih lengkap sedang disiapkan.",
    featured: true,
    stats: [
      { value: "Rule-Based AI" },
      { value: "Mood Recommendation" },
      { value: "React Interface" },
    ],
  },
  {
    slug: "nubofind",
    number: "04",
    title: "NuboFind",
    shortTitle: "NuboFind",
    category: "Sports Search & Data",
    summary:
      "Project information retrieval bertema olahraga yang mengeksplorasi search, indexing, dan penemuan data terstruktur.",
    year: "2025",
    technologies: ["Information Retrieval", "Search", "Data Processing"],
    githubUrl: "https://github.com/CaesarAidarus22/Project-Penelusuran-Informasi-kel14",
    accent: "slate",
    accentColor: "#7991a4",
    status: "Public repository sudah tersedia; dokumentasi project yang lebih lengkap masih disiapkan.",
  },
  {
    slug: "nlp-speech-pipeline",
    number: "05",
    title: "NLP Speech Code-Switching Pipeline",
    shortTitle: "NLP Speech Pipeline",
    category: "Natural Language Processing",
    summary:
      "Sistem code-switching speech end-to-end yang menghubungkan transkripsi, normalisasi, language tagging, response generation, dan speech output.",
    description:
      "Dibangun sebagai final project Praktikum NLP, pipeline ini memproses audio campuran bahasa dari input hingga menghasilkan respons suara.",
    role: "Student Developer",
    year: "2026",
    technologies: ["Whisper", "Node.js", "Gemini", "Text-to-Speech", "NLP"],
    githubUrl: "https://github.com/CaesarAidarus22/UAS-Prak_NLP_M.CaesarAidarus_2372",
    problem:
      "Code-switching speech membutuhkan beberapa tahap pemrosesan yang bekerja bersama: transkripsi, text cleanup, language awareness, response generation, dan speech synthesis.",
    solution:
      "Project ini menyusun seluruh tahap tersebut menjadi pipeline yang dapat dikonfigurasi, menggunakan speech-to-text berbasis Whisper, language tagging, integrasi Gemini, fallback response generator, dan output text-to-speech.",
    architecture: [
      "Audio input dan speech-to-text dengan Whisper",
      "Normalisasi teks dan language tagging",
      "Gemini response generation dengan local fallback",
      "Output audio text-to-speech",
    ],
    features: [
      "Transkripsi code-switching",
      "Language tagging",
      "Fallback response generation",
      "Experiment logging dan web demo",
    ],
    results:
      "Repository menyertakan experiment output dan ringkasan corpus sehingga perilaku pipeline dapat diperiksa, bukan diperlakukan sebagai black box.",
    lessons:
      "Sistem NLP end-to-end menjadi lebih terukur dengan tahapan eksplisit dan fallback yang dapat diganti. Setiap tahap bisa diuji dan ditingkatkan secara independen.",
    accent: "purple",
    accentColor: "#8d7ca6",
  },
  {
    slug: "yolo-queue-detection",
    number: "06",
    title: "YOLO Queue Detection System",
    shortTitle: "YOLO Queue Detection",
    category: "Computer Vision",
    summary:
      "Pipeline Computer Vision yang mendeteksi dan menghitung orang dalam gambar antrean, lalu mengklasifikasikan tingkat kepadatannya.",
    description:
      "Dibangun untuk project mata kuliah Computer Vision, sistem ini menjalankan YOLOv3-tiny melalui OpenCV DNN dan menghasilkan annotated image.",
    role: "Student Developer",
    year: "2025",
    technologies: ["Python", "OpenCV", "YOLOv3-tiny", "Computer Vision"],
    githubUrl:
      "https://github.com/CaesarAidarus22/UAS-Viskom-M.Caesar-Aidarus-2308107010072-Deteksi-Orang-Dalam-Antrian",
    problem:
      "Memperkirakan kepadatan antrean dari still image membutuhkan person detection yang andal sekaligus mengurangi false positive dari objek yang tampak serupa.",
    solution:
      "Pipeline melakukan preprocessing gambar, menjalankan YOLOv3-tiny melalui OpenCV DNN, menerapkan non-maximum suppression dan heuristic filtering, lalu menampilkan jumlah orang serta kategori kepadatan.",
    architecture: [
      "Preprocessing grayscale, blur, dan edge",
      "Inference YOLOv3-tiny melalui OpenCV DNN",
      "Non-maximum suppression dan heuristic filtering",
      "Output annotated image dan klasifikasi kepadatan",
    ],
    features: [
      "Person detection dan counting",
      "Kategorisasi kepadatan antrean",
      "Visualisasi bounding box",
      "Image processing melalui command line",
    ],
    challenges: [
      "Occlusion antarorang dalam antrean padat",
      "Subjek berukuran kecil pada gambar yang lebar",
      "Mengurangi false positive dengan detector yang ringan",
    ],
    results:
      "Sistem menghasilkan annotated image yang tersimpan, lengkap dengan orang yang terdeteksi, jumlah total, dan label antrean sepi, sedang, atau padat.",
    lessons:
      "Pemilihan model dan post-processing menyeimbangkan accuracy dengan speed. Langkah berikutnya yang terdokumentasi adalah mengevaluasi model YOLO yang lebih baru dan training data khusus antrean.",
    accent: "amber",
    accentColor: "#b78a4c",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);

  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}
