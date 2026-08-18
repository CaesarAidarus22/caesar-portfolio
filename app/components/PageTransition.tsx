"use client";

import { useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type TransitionState = {
  phase: "cover" | "reveal";
  direction: "warm" | "cool";
} | null;

function isTransitionRoute(from: string, to: string) {
  return (from === "/" && to === "/about") || (from === "/about" && to === "/");
}

export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [transition, setTransition] = useState<TransitionState>(null);
  const pendingPath = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const navigate = (href: string) => {
    const url = new URL(href, window.location.href);
    const destinationPath = url.pathname;

    const motionDisabled = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isTransitionRoute(pathname, destinationPath) || reduceMotion || motionDisabled) {
      router.push(`${url.pathname}${url.search}${url.hash}`);
      return;
    }

    clearTimers();
    pendingPath.current = destinationPath;
    setTransition({ phase: "cover", direction: destinationPath === "/about" ? "warm" : "cool" });
    timers.current.push(window.setTimeout(() => router.push(`${url.pathname}${url.search}${url.hash}`), 270));
    timers.current.push(window.setTimeout(() => {
      pendingPath.current = null;
      setTransition(null);
    }, 1400));
  };

  useEffect(() => {
    if (!pendingPath.current || pathname !== pendingPath.current) return;
    clearTimers();
    setTransition((current) => current ? { ...current, phase: "reveal" } : null);
    timers.current.push(window.setTimeout(() => {
      pendingPath.current = null;
      setTransition(null);
    }, 360));
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!target || target.target === "_blank" || target.hasAttribute("download")) return;

      const url = new URL(target.href, window.location.href);
      if (url.origin !== window.location.origin || !isTransitionRoute(pathname, url.pathname)) return;
      event.preventDefault();
      navigate(`${url.pathname}${url.search}${url.hash}`);
    };

    const handleNavigate = (event: Event) => {
      const href = (event as CustomEvent<{ href: string }>).detail?.href;
      if (href) navigate(href);
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("cinematic-navigate", handleNavigate);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("cinematic-navigate", handleNavigate);
    };
  }, [pathname, reduceMotion]);

  useEffect(() => () => clearTimers(), []);

  return (
    <div
      className={`page-transition ${transition ? `page-transition--${transition.direction} page-transition--${transition.phase}` : ""}`}
      aria-hidden="true"
    />
  );
}
