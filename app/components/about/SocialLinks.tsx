"use client";

import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiGithub, SiInstagram, SiSpotify, SiTiktok } from "react-icons/si";
import { socialLinks, type SocialPlatform } from "@/app/data/socialLinks";

const socialPlatforms: Array<{
  key: SocialPlatform;
  name: string;
  note: string;
  icon: IconType;
  color: string;
}> = [
  { key: "spotify", name: "Spotify", note: "Profil musik", icon: SiSpotify, color: "#1DB954" },
  { key: "instagram", name: "Instagram", note: "Profil sosial", icon: SiInstagram, color: "#E879A9" },
  { key: "tiktok", name: "TikTok", note: "Profil sosial", icon: SiTiktok, color: "#69C9D0" },
  { key: "github", name: "GitHub", note: "Code dan project", icon: SiGithub, color: "#FFFFFF" },
  { key: "linkedin", name: "LinkedIn", note: "Profil profesional", icon: FaLinkedinIn, color: "#5A9BD5" },
];

export default function SocialLinks() {
  return (
    <section className="about-social" aria-labelledby="about-social-title">
      <div className="about-section-heading about-section-heading--social">
        <div className="about-kicker"><span>03</span>Digital life</div>
        <h2 id="about-social-title">Find me online.</h2>
      </div>

      <div className="about-social__grid">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          const url = socialLinks[platform.key];
          const content = (
            <>
              <span className="about-social__icon"><Icon aria-hidden="true" /></span>
              <span className="about-social__copy">
                <strong>{platform.name}</strong>
                <small>{url ? platform.note : "Belum terhubung"}</small>
              </span>
              {url ? <ArrowUpRight size={18} aria-hidden="true" /> : <span className="about-social__status">Belum aktif</span>}
            </>
          );
          const style = { "--social-color": platform.color } as CSSProperties;

          return url ? (
            <a
              key={platform.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open Caesar's ${platform.name} profile`}
              className={`about-social__card about-social__card--${platform.key}`}
              style={style}
            >
              {content}
            </a>
          ) : (
            <div
              key={platform.key}
              className={`about-social__card about-social__card--disabled about-social__card--${platform.key}`}
              style={style}
              aria-disabled="true"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
