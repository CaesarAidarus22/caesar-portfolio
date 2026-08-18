import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050608",
        surface: "#0B0F14",
        card: "#111827",
        primary: "#F8FAFC",
        secondary: "#94A3B8",
        accent: "#0645C4",
        accentHover: "#2563EB",
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "Inter", "sans-serif"],
        body: ["var(--font-body)", "Inter", "Arial", "sans-serif"],
      },
      boxShadow: {
        cinematic: "0 32px 90px rgba(0, 0, 0, 0.42)",
        soft: "0 20px 60px rgba(0, 0, 0, 0.26)",
      },
    },
  },
  plugins: [],
};

export default config;
