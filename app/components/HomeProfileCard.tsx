"use client";

import { useReducedMotion } from "framer-motion";
import { MousePointerClick, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";

const focusAreas = ["Engineering", "AI Systems", "Data Mining", "Creative Tech"];

export default function HomeProfileCard() {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);
  const pointerFrame = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(
    () => () => {
      if (pointerFrame.current !== null) {
        window.cancelAnimationFrame(pointerFrame.current);
      }
    },
    [],
  );

  const resetTilt = (card: HTMLButtonElement) => {
    card.style.setProperty("--home-tilt-x", "0deg");
    card.style.setProperty("--home-tilt-y", "0deg");
    card.style.setProperty("--home-light-x", "50%");
    card.style.setProperty("--home-light-y", "32%");
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse" || reduceMotion || flipped) {
      return;
    }

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    if (pointerFrame.current !== null) {
      window.cancelAnimationFrame(pointerFrame.current);
    }

    pointerFrame.current = window.requestAnimationFrame(() => {
      card.style.setProperty("--home-tilt-x", `${y * -5}deg`);
      card.style.setProperty("--home-tilt-y", `${x * 5}deg`);
      card.style.setProperty("--home-light-x", `${(x + 0.5) * 100}%`);
      card.style.setProperty("--home-light-y", `${(y + 0.5) * 100}%`);
    });
  };

  const toggleCard = () => {
    if (cardRef.current) {
      resetTilt(cardRef.current);
    }
    setFlipped((value) => !value);
  };

  return (
    <button
      ref={cardRef}
      type="button"
      className={`home-profile-card ${flipped ? "home-profile-card--flipped" : ""}`}
      aria-label={flipped ? "Show Caesar's portrait" : "Discover Caesar's professional focus"}
      aria-pressed={flipped}
      onClick={toggleCard}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => resetTilt(event.currentTarget)}
    >
      <span className="home-profile-card__tilt">
        <span className="home-profile-card__inner">
          <span className="home-profile-card__face home-profile-card__front">
            <Image
              src="/images/portrait-caesar.jpg"
              alt="Muhammad Caesar Aidarus"
              fill
              priority
              sizes="(min-width: 1024px) 31rem, 90vw"
              className="home-profile-card__photo"
            />
            <span className="home-profile-card__front-wash" aria-hidden="true" />
            <span className="home-profile-card__scanline" aria-hidden="true" />
            <span className="home-profile-card__front-id">
              <small>PROFILE / 01</small>
              <strong>M. Caesar Aidarus</strong>
            </span>
            <span className="home-profile-card__hint">
              <MousePointerClick size={14} aria-hidden="true" />
              <span className="home-profile-card__hint-desktop">Click to discover</span>
              <span className="home-profile-card__hint-mobile">Tap to discover</span>
            </span>
          </span>

          <span className="home-profile-card__face home-profile-card__back">
            <span className="home-profile-card__back-grid" aria-hidden="true" />
            <span className="home-profile-card__back-glow" aria-hidden="true" />
            <span className="home-profile-card__system-line">
              <i aria-hidden="true" /> SYSTEM PROFILE / ACTIVE
            </span>
            <span className="home-profile-card__back-copy">
              <small>Professional identity</small>
              <strong>Building with purpose.</strong>
              <span>Software Engineer<br />AI &amp; Data Mining Enthusiast</span>
            </span>
            <span className="home-profile-card__focus-grid">
              {focusAreas.map((area, index) => (
                <span key={area}><i>{String(index + 1).padStart(2, "0")}</i>{area}</span>
              ))}
            </span>
            <span className="home-profile-card__summary">
              Saya membangun produk digital yang menggabungkan software engineering,
              AI, data, dan pengalaman pengguna yang relevan.
            </span>
            <span className="home-profile-card__return">
              <RotateCcw size={14} aria-hidden="true" /> Kembali ke portrait
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
