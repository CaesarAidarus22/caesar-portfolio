export const socialLinks = {
  spotify: "https://open.spotify.com/user/317ztmmpiw6bxfldofoifg6bczne?si=3b8d545817f94804",
  instagram: "https://www.instagram.com/caesar._22/?hl=en",
  tiktok: "https://www.tiktok.com/@cae.nii",
  github: "https://github.com/CaesarAidarus22",
  linkedin: "https://www.linkedin.com/in/muhammad-caesar-0767a7392/",
} as const;

export type SocialPlatform = keyof typeof socialLinks;

