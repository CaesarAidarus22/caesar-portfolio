export type ChatLanguage = "id" | "en";
export type ChatLanguageMode = "auto" | ChatLanguage;

export type ChatIntent =
  | "identity"
  | "education"
  | "projects"
  | "ai_projects"
  | "skills"
  | "tech_stack"
  | "frontend"
  | "backend"
  | "ai_data"
  | "python"
  | "github_activity"
  | "github"
  | "linkedin"
  | "contact"
  | "project_technology"
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
  language: ChatLanguage;
  intent: ChatIntent;
  actions: ChatAction[];
  context: ChatContext;
};
