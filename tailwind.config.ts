import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // palet merah-putih-hitam (nama semantik)
        base: "#FFFFFF", // latar utama
        surface: "#FAF6F5", // latar kartu/section kedua
        brand: "#D7261E", // merah utama
        brandDeep: "#A3140E", // merah gelap untuk hover/kartu alternatif
        blush: "#FCE9E7", // merah sangat muda untuk tint
        ink: "#111111", // hitam teks dan kontras
        muted: "#6B6363", // teks sekunder
        line: "#EADCDA", // garis pemisah
      },
      fontFamily: {
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Inter Tight Variable"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.045em" },
    },
  },
  plugins: [],
} satisfies Config;
