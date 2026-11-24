const corrections: Array<[RegExp, string]> = [
  [/\bprojek\b/g, "project"],
  [/\bprojectnya\b/g, "project"],
  [/\bteck\b/g, "tech"],
  [/\bgitub\b/g, "github"],
  [/\bgithubnya\b/g, "github"],
  [/\blinkdn\b/g, "linkedin"],
  [/\bkontaknya\b/g, "kontak"],
  [/\bmachin\b/g, "machine"],
  [/\bpake\b/g, "pakai"],
  [/\bdimana\b/g, "di mana"],
  [/\bga\b/g, "tidak"],
  [/\bgak\b/g, "tidak"],
];

export function normalizeText(value: string) {
  let normalized = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  corrections.forEach(([pattern, replacement]) => {
    normalized = normalized.replace(pattern, replacement);
  });

  return normalized.replace(/\s+/g, " ").trim();
}
