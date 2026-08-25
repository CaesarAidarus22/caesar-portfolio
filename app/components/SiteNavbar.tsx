"use client";

import { motion } from "framer-motion";
import { Command, Github, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { socialLinks } from "@/app/data/socialLinks";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/#projects" },
  { label: "GitHub", href: "/#github-activity" },
  { label: "Journey", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
] as const;

export default function SiteNavbar({ theme = "cool" }: { theme?: "cool" | "warm" }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [homeHash, setHomeHash] = useState("");
  const isAbout = pathname === "/about";

  const activeLabel = (() => {
    if (pathname === "/about") return "About";
    if (pathname === "/projects" || pathname.startsWith("/projects/")) return "Projects";
    if (pathname !== "/") return null;

    if (homeHash === "#projects") return "Projects";
    if (homeHash === "#github-activity") return "GitHub";
    if (homeHash === "#experience") return "Journey";
    if (homeHash === "#contact") return "Contact";
    return "Home";
  })();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const syncHash = () => setHomeHash(pathname === "/" ? window.location.hash : "");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-4 z-50 px-4 sm:top-5 sm:px-6"
    >
      <nav
        className={`site-navbar site-navbar--${theme} ${scrolled ? "site-navbar--scrolled" : ""}`}
        aria-label="Primary navigation"
      >
        <Link
          href={isAbout ? "/" : "/#top"}
          className="font-display text-sm font-semibold tracking-[0.28em] text-primary"
        >
          CAESAR
        </Link>

        <div className="hidden items-center gap-5 lg:gap-7 md:flex">
          {navLinks.map((link) => {
            const active = link.label === activeLabel;
            const current = active
              ? pathname === "/" && link.href.includes("#")
                ? "location"
                : "page"
              : undefined;
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={current}
                className={`site-navbar__link ${active ? "site-navbar__link--active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="site-navbar__icon-button"
          >
            <Github size={17} />
          </a>
          <button
            type="button"
            className="site-navbar__cv site-navbar__command"
            onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
          >
            <Command size={14} /> <span>Ctrl K</span>
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="site-navbar__menu-button md:hidden"
        >
          <Menu size={18} />
        </button>
      </nav>

      {open ? (
        <div className={`site-navbar__mobile site-navbar__mobile--${theme} md:hidden`}>
          <div className="grid gap-1">
            {navLinks.map((link) => {
              const active = link.label === activeLabel;
              const current = active
                ? pathname === "/" && link.href.includes("#")
                  ? "location"
                  : "page"
                : undefined;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={current}
                  onClick={() => setOpen(false)}
                  className={active ? "is-active" : ""}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="site-navbar__mobile-action"
            >
              <Github size={17} />
              GitHub
            </a>
            <button
              type="button"
              className="site-navbar__mobile-action"
              onClick={() => {
                setOpen(false);
                window.dispatchEvent(new Event("open-command-palette"));
              }}
            >
              <Command size={16} /> Commands
            </button>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
