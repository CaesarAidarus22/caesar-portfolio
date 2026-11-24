"use client";

import { motion, useScroll, useTransform } from "motion/react";

const ITEMS = ["Computer Vision", "NLP", "Transfer Learning", "FastAPI", "TensorFlow", "LLM Integration", "Sentiment Analysis", "Speech"];

export default function Marquee() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [-2.5, 2.5]);

  const row = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="display px-6 text-[clamp(2.2rem,5vw,4.5rem)] italic">{item}</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white md:h-8 md:w-8" aria-hidden>
            <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12C7 11 11 7 12 0Z" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <motion.div data-theme="brand" style={{ rotate }} className="relative z-10 -mx-4 my-10 overflow-hidden bg-brand py-4 text-white md:py-6">
      <div className="animate-marquee flex w-max">
        {row}
        {row}
      </div>
    </motion.div>
  );
}
