"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { getDictionary, type Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/site";
import Preloader from "./Preloader";
import Cursor from "./Cursor";

type Ctx = { locale: Locale; t: Dictionary; ready: boolean; lenis: Lenis | null };
const AppContext = createContext<Ctx | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <Providers>");
  return ctx;
}

export default function Providers({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    setLenis(instance);
    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (ready) lenis.start();
    else lenis.stop();
  }, [ready, lenis]);

  useEffect(() => {
    try {
      document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
  }, [locale]);

  return (
    <AppContext.Provider value={{ locale, t: getDictionary(locale), ready, lenis }}>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      {children}
    </AppContext.Provider>
  );
}
