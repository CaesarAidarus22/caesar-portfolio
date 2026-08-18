"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, type PointerEvent } from "react";
import SiteNavbar from "../SiteNavbar";
import AboutBento from "./AboutBento";
import AboutHero from "./AboutHero";
import SocialLinks from "./SocialLinks";

export default function AboutPageClient() {
  const spotlightRef = useRef<HTMLDivElement>(null);
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

  const moveSpotlight = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || reduceMotion || !spotlightRef.current) {
      return;
    }

    const spotlight = spotlightRef.current;
    if (pointerFrame.current !== null) {
      window.cancelAnimationFrame(pointerFrame.current);
    }

    pointerFrame.current = window.requestAnimationFrame(() => {
      spotlight.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate3d(-50%, -50%, 0)`;
      spotlight.style.opacity = "1";
    });
  };

  return (
    <main className="about-page" onPointerMove={moveSpotlight}>
      <SiteNavbar theme="warm" />
      <div className="about-page__grid" aria-hidden="true" />
      <div className="about-page__grain" aria-hidden="true" />
      <div className="about-page__ambient" aria-hidden="true" />
      <div ref={spotlightRef} className="about-page__pointer-light" aria-hidden="true" />

      <div className="about-page__content">
        <AboutHero />
        <AboutBento />
        <SocialLinks />

        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="about-return"
        >
          <div>
            <div className="about-kicker"><span>04</span>Back to the work</div>
            <h2>Lihat bagaimana rasa ingin tahu berubah menjadi project.</h2>
          </div>
          <div className="about-return__actions">
            <Link href="/#projects" className="about-return__primary">
              Explore projects <ArrowUpRight size={18} />
            </Link>
            <Link href="/" className="about-return__secondary">
              <ArrowLeft size={17} /> Back home
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
