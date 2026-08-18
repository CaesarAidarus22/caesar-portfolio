"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type PointerEvent } from "react";
import { techStack } from "@/app/data/techStack";
import TechMarquee from "./TechMarquee";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function TechStackSection() {
  const panelRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const panelInView = useInView(panelRef, { margin: "150px 0px" });
  const firstRow = techStack.filter((technology) => technology.row === 1);
  const secondRow = techStack.filter((technology) => technology.row === 2);

  const moveSpotlight = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || reduceMotion) {
      return;
    }

    const panel = panelRef.current;
    const spotlight = spotlightRef.current;

    if (!panel || !spotlight) {
      return;
    }

    const bounds = panel.getBoundingClientRect();
    spotlight.style.opacity = "1";
    spotlight.style.transform = `translate3d(${event.clientX - bounds.left}px, ${
      event.clientY - bounds.top
    }px, 0) translate3d(-50%, -50%, 0)`;
  };

  const hideSpotlight = () => {
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
  };

  return (
    <section id="tech-stack" className="tech-stack-section relative px-5 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ staggerChildren: reduceMotion ? 0 : 0.09 }}
          className="max-w-3xl"
        >
          <motion.p
            variants={reveal}
            transition={{ duration: 0.55 }}
            className="font-display text-sm uppercase tracking-[0.32em] text-secondary"
          >
            Tech Stack
          </motion.p>
          <motion.h2
            variants={reveal}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-display text-4xl font-semibold leading-tight text-primary sm:text-6xl"
          >
            Tools behind the things I build.
          </motion.h2>
          <motion.p
            variants={reveal}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-base leading-8 text-secondary sm:text-lg"
          >
            Bahasa pemrograman, framework, tools, dan platform yang saya gunakan
            dalam Software Engineering, AI, data, dan web development.
          </motion.p>
        </motion.div>

        <motion.div
          ref={panelRef}
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ delay: reduceMotion ? 0 : 0.24, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`tech-stack-panel ${panelInView ? "tech-stack-panel--active" : ""}`}
          onPointerMove={moveSpotlight}
          onPointerLeave={hideSpotlight}
        >
          <div className="tech-stack-panel__grid" aria-hidden="true" />
          <div ref={spotlightRef} className="tech-stack-panel__spotlight" aria-hidden="true" />
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: reduceMotion ? 0 : 0.38, duration: 0.65 }}
          >
            <TechMarquee technologies={firstRow} direction="left" row={1} />
          </motion.div>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: reduceMotion ? 0 : 0.5, duration: 0.65 }}
          >
            <TechMarquee technologies={secondRow} direction="right" row={2} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
