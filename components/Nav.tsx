"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { useApp } from "./Providers";
import { EASE, LocalClock } from "./ui";
import { site } from "@/lib/site";

export default function Nav() {
  const { t, locale, ready, lenis } = useApp();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > 400 && v > prev);
  });

  const other = locale === "id" ? "en" : "id";
  const switchHref = pathname.replace(/^\/(id|en)/, `/${other}`);
  const home = `/${locale}`;
  const links = [
    ["01", t.nav.about, "#about"],
    ["02", t.nav.work, "#work"],
    ["03", t.nav.capabilities, "#capabilities"],
    ["04", t.nav.journey, "#journey"],
    ["05", t.nav.contact, "#contact"],
  ] as const;

  const go = (hash: string) => {
    setOpen(false);
    const onHome = pathname === home;
    if (!onHome) {
      window.location.href = `${home}${hash}`;
      return;
    }
    const el = document.querySelector(hash) as HTMLElement | null;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-5 pt-4 md:px-8 md:pt-5"
        initial={{ y: -80, opacity: 0 }}
        animate={ready ? { y: hidden && !open ? -90 : 0, opacity: 1 } : undefined}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="flex items-center justify-between rounded-full border border-ink/10 bg-base/75 py-2 pl-5 pr-2 backdrop-blur-md">
          <Link href={home} className="flex items-baseline gap-1 font-serif text-2xl leading-none" data-cursor="Home">
            {site.initials}
            <span className="font-mono text-[10px] text-brand">©26</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map(([n, label, hash]) => (
              <button key={hash} onClick={() => go(hash)} className="group flex items-baseline gap-1.5 text-[14px]">
                <span className="font-mono text-[10px] text-muted">{n}</span>
                <span className="relative">
                  {label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-ink transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="label hidden items-center gap-2 md:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              <LocalClock />
            </span>
            <Link
              href={switchHref}
              className="label rounded-full border border-ink/15 px-3 py-2 !text-ink transition-colors hover:bg-ink hover:!text-white"
              aria-label={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
            >
              <span className={locale === "id" ? "text-brand" : ""}>ID</span>
              <span className="mx-1 opacity-40">/</span>
              <span className={locale === "en" ? "text-brand" : ""}>EN</span>
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              className="rounded-full bg-ink px-4 py-2 text-[13px] text-white lg:hidden"
              aria-expanded={open}
            >
              {open ? t.nav.close : t.nav.menu}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-brand px-5 pb-10 text-white lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {links.map(([n, label, hash], i) => (
              <motion.button
                key={hash}
                onClick={() => go(hash)}
                className="flex items-baseline gap-3 border-b border-white/25 py-3 text-left"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease: EASE }}
              >
                <span className="font-mono text-xs opacity-95">{n}</span>
                <span className="display text-6xl">{label}</span>
              </motion.button>
            ))}
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-widest">
              <a href={site.social.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
