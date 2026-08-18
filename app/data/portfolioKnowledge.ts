import { projects } from "./projects";
import { socialLinks } from "./socialLinks";

export const portfolioFacts = {
  person: {
    name: "Muhammad Caesar Aidarus",
    shortName: "Caesar",
    program: "Informatika",
    institution: "Universitas Syiah Kuala",
    identity: "Software Engineer, AI & Data Mining Enthusiast",
    interests: [
      "Software Engineering",
      "Artificial Intelligence",
      "Data Mining",
      "Machine Learning",
      "Natural Language Processing",
      "Computer Vision",
    ],
  },
  skills: {
    frontend: ["React", "Next.js", "TypeScript", "JavaScript", "responsive CSS"],
    backend: ["FastAPI", "Express", "Node.js", "REST API", "JWT"],
    ai: ["Python", "TensorFlow", "EfficientNetB0", "OpenCV", "YOLO", "Whisper", "Gemini"],
    data: ["Data Mining", "PostgreSQL", "Supabase", "Scikit-learn"],
  },
  projects,
  aiProjectSlugs: [
    "smart-insect-identifier",
    "nlp-speech-pipeline",
    "yolo-queue-detection",
    "gabutbot",
  ],
  social: socialLinks,
  contact: {
    email: null,
    preferred: ["linkedin", "github"] as const,
  },
} as const;
