export const journeyItems = [
  {
    period: "2025",
    title: "Fondasi search dan Computer Vision",
    type: "ACADEMIC EXPLORATION",
    description:
      "Mengeksplorasi Information Retrieval melalui NuboFind dan Computer Vision praktis melalui sistem deteksi antrean berbasis YOLO.",
    technologies: ["Information Retrieval", "Python", "OpenCV", "YOLO"],
    projectSlugs: ["nubofind", "yolo-queue-detection"],
  },
  {
    period: "2026",
    title: "Membawa model menjadi produk yang berguna",
    type: "AI + SOFTWARE PROJECTS",
    description:
      "Menghubungkan Machine Learning dan full-stack engineering melalui Smart Insect Identifier dan CampusFind, dengan API, interface, data, serta failure state yang diperlakukan sebagai satu sistem.",
    technologies: ["TensorFlow", "FastAPI", "React", "Supabase"],
    projectSlugs: ["smart-insect-identifier", "campusfind"],
  },
  {
    period: "ONGOING",
    title: "Eksplorasi language dan conversational systems",
    type: "NLP EXPERIMENTS",
    description:
      "Terus mengeksplorasi conversational interface dan language pipeline melalui GabutBot serta project code-switching speech end-to-end.",
    technologies: ["Whisper", "Gemini", "Chatbot Logic", "Text-to-Speech"],
    projectSlugs: ["gabutbot", "nlp-speech-pipeline"],
  },
] as const;
