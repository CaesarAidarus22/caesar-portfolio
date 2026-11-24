"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const EASE = [0.76, 0, 0.24, 1] as const;
const WORDS = ["Halo", "Hello", "Assalamu'alaikum", "Caesar"];

/**
 * Pembuka ala huyml: hitungan 0→100, kata sapaan berganti,
 * lalu tirai naik memperlihatkan hero. Hanya sekali per sesi.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("ca-loaded") === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setShow(false);
      onDone();
      return;
    }

    const duration = 2000;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      setWord(Math.min(WORDS.length - 1, Math.floor(p * WORDS.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          try {
            sessionStorage.setItem("ca-loaded", "1");
          } catch {}
          setShow(false);
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-brand p-5 text-white md:p-8"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: EASE }}
          aria-hidden
        >
          <div className="flex items-start justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
            <span>Caesar Aidarus ©2026</span>
            <span>Portfolio v2</span>
          </div>

          <div className="flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={word}
                className="display text-[clamp(3rem,11vw,9rem)] italic"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {WORDS[word]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex items-end justify-between">
            <div className="h-[2px] w-1/2 bg-white/30">
              <div className="h-full bg-white" style={{ width: `${count}%` }} />
            </div>
            <span className="display text-[clamp(4rem,14vw,12rem)] tabular-nums leading-none">
              {count}
              <span className="text-[0.4em] align-top">%</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
