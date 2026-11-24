import type { Locale } from "@/lib/site";

export type ChatLanguage = Locale;

export type ChatIntent =
  | "identity"
  | "education"
  | "projects"
  | "ai_projects"
  | "project_detail"
  | "project_technology"
  | "skills"
  | "tech_stack"
  | "frontend"
  | "backend"
  | "ai_data"
  | "python"
  | "experience"
  | "competitions"
  | "github"
  | "linkedin"
  | "contact"
  | "out_of_scope"
  | "unknown";

export type ChatAction = {
  label: string;
  href: string;
  external?: boolean;
};

export type ChatContext = {
  lastIntent?: ChatIntent;
  lastProjectSlugs?: string[];
};

export type ChatResponse = {
  text: string;
  intent: ChatIntent;
  actions: ChatAction[];
  context: ChatContext;
};
