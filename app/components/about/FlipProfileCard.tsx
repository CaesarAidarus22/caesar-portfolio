"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";

const keywords = ["Curious", "Builder", "Learner", "Experimenter"];

export default function FlipProfileCard() {
  const [flipped, setFlipped] = useState(false);
  const frameRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse" || reduceMotion || flipped) {
      return;
    }

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = window.requestAnimationFrame(() => {
      card.style.setProperty("--about-tilt-x", `${y * -7}deg`);
      card.style.setProperty("--about-tilt-y", `${x * 7}deg`);
      card.style.setProperty("--about-light-x", `${(x + 0.5) * 100}%`);
      card.style.setProperty("--about-light-y", `${(y + 0.5) * 100}%`);
    });
  };

  const resetTilt = (card: HTMLButtonElement) => {
    card.style.setProperty("--about-tilt-x", "0deg");
    card.style.setProperty("--about-tilt-y", "0deg");
    card.style.setProperty("--about-light-x", "50%");
    card.style.setProperty("--about-light-y", "35%");
  };

  return (
    <button
      type="button"
      className={`flip-profile-card ${flipped ? "flip-profile-card--flipped" : ""}`}
      aria-label={flipped ? "Show Caesar's portrait" : "Discover more about Caesar"}
      aria-pressed={flipped}
      onClick={() => setFlipped((value) => !value)}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => resetTilt(event.currentTarget)}
    >
      <span className="flip-profile-card__tilt">
        <span className="flip-profile-card__inner">
          <span className="flip-profile-card__face flip-profile-card__front">
            <Image
              src="/images/caesar-about.jpeg"
              alt="Muhammad Caesar Aidarus"
              fill
              priority
              sizes="(min-width: 1024px) 28rem, (min-width: 640px) 25rem, 88vw"
              className="flip-profile-card__photo"
            />
            <span className="flip-profile-card__front-wash" aria-hidden="true" />
            <span className="flip-profile-card__identity">
              <small>Portrait 01</small>
              <strong>M. Caesar Aidarus</strong>
            </span>
            <span className="flip-profile-card__hint">
              <span className="hidden sm:inline">Click to discover</span>
              <span className="sm:hidden">Tap to discover</span>
              <i aria-hidden="true">↗</i>
            </span>
          </span>

          <span className="flip-profile-card__face flip-profile-card__back">
            <span className="flip-profile-card__back-grid" aria-hidden="true" />
            <span className="flip-profile-card__back-heading">
              <small>Personal notes / 04</small>
              <strong>Beyond the code.</strong>
            </span>
            <span className="flip-profile-card__keywords">
              {keywords.map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </span>
            <span className="flip-profile-card__summary">
              Saya menikmati proses mengubah ide menjadi produk digital yang berguna,
              sambil terus mengeksplorasi AI, data, software, dan teknologi kreatif.
            </span>
            <span className="flip-profile-card__hint flip-profile-card__hint--back">
              Return to portrait
              <i aria-hidden="true">↙</i>
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
