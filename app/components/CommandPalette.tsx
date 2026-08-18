"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BriefcaseBusiness,
  Code2,
  Download,
  Github,
  Home,
  Layers3,
  Linkedin,
  MessageCircle,
  Search,
  Sparkles,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/app/data/projects";
import { socialLinks } from "@/app/data/socialLinks";

type CommandGroup = "Navigation" | "Projects" | "Social" | "Actions";
type PaletteCommand = {
  id: string;
  label: string;
  detail?: string;
  group: CommandGroup;
  icon: LucideIcon;
  keywords: string;
  href?: string;
  external?: boolean;
  action?: "chat";
  disabled?: boolean;
};

const baseCommands: PaletteCommand[] = [
  { id: "home", label: "Home", group: "Navigation", icon: Home, keywords: "top landing", href: "/" },
  { id: "about", label: "About Me", group: "Navigation", icon: UserRound, keywords: "profile background person", href: "/about" },
  { id: "featured", label: "Featured Projects", group: "Navigation", icon: Layers3, keywords: "work case studies", href: "/#projects" },
  { id: "github-activity", label: "GitHub Activity", group: "Navigation", icon: Github, keywords: "contributions streak", href: "/#github-activity" },
  { id: "journey", label: "Journey", group: "Navigation", icon: BriefcaseBusiness, keywords: "experience timeline milestones", href: "/#experience" },
  { id: "stack", label: "Tech Stack", group: "Navigation", icon: Code2, keywords: "tools technologies", href: "/#tech-stack" },
  { id: "contact", label: "Contact", group: "Navigation", icon: MessageCircle, keywords: "reach connect", href: "/#contact" },
  { id: "ask", label: "Ask Caesar", detail: "Open portfolio assistant", group: "Actions", icon: Sparkles, keywords: "chat assistant question", action: "chat" },
  { id: "cv", label: "Download CV", detail: "CV file has not been added yet", group: "Actions", icon: Download, keywords: "resume curriculum vitae", disabled: true },
  { id: "github-profile", label: "GitHub Profile", group: "Social", icon: Github, keywords: "code repositories", href: socialLinks.github, external: true },
  { id: "linkedin", label: "LinkedIn", group: "Social", icon: Linkedin, keywords: "professional profile", href: socialLinks.linkedin, external: true },
];

const projectCommands: PaletteCommand[] = projects.map((project) => ({
  id: `project-${project.slug}`,
  label: `Open ${project.shortTitle}`,
  detail: project.category,
  group: "Projects",
  icon: Layers3,
  keywords: `${project.title} ${project.technologies.join(" ")}`,
  href: `/projects/${project.slug}`,
}));

const allCommands = [...baseCommands, ...projectCommands];
const groupOrder: CommandGroup[] = ["Navigation", "Projects", "Social", "Actions"];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const pendingActionRef = useRef<"chat" | null>(null);
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return allCommands;
    return allCommands.filter((command) =>
      `${command.label} ${command.detail ?? ""} ${command.keywords}`.toLowerCase().includes(search),
    );
  }, [query]);

  const close = () => {
    setOpen(false);
  };

  const show = () => {
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    window.dispatchEvent(new Event("close-ask-caesar"));
    setQuery("");
    setSelected(0);
    setOpen(true);
  };

  const run = (command: PaletteCommand) => {
    if (command.disabled) return;
    close();
    if (command.action === "chat") {
      pendingActionRef.current = "chat";
    } else if (command.external && command.href) {
      window.open(command.href, "_blank", "noopener,noreferrer");
    } else if (command.href) {
      const destination = new URL(command.href, window.location.href);
      const cinematic =
        (window.location.pathname === "/" && destination.pathname === "/about") ||
        (window.location.pathname === "/about" && destination.pathname === "/");
      if (cinematic) {
        window.dispatchEvent(new CustomEvent("cinematic-navigate", { detail: { href: command.href } }));
      } else {
        router.push(command.href);
      }
    }
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open ? close() : show();
      }
    };
    const handleOpen = () => show();
    const handleClose = () => setOpen(false);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("open-command-palette", handleOpen);
    window.addEventListener("close-command-palette", handleClose);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("open-command-palette", handleOpen);
      window.removeEventListener("close-command-palette", handleClose);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  useEffect(() => setSelected(0), [query]);

  const handleDialogKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((value) => (value + 1) % Math.max(filtered.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((value) => (value - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
    } else if (event.key === "Enter" && filtered[selected]) {
      event.preventDefault();
      run(filtered[selected]);
    } else if (event.key === "Tab") {
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("input, button:not(:disabled)") ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <AnimatePresence
      onExitComplete={() => {
        restoreFocusRef.current?.focus();
        if (pendingActionRef.current === "chat") {
          pendingActionRef.current = null;
          window.requestAnimationFrame(() => {
            window.dispatchEvent(new Event("open-ask-caesar"));
          });
        }
      }}
    >
      {open ? (
        <motion.div
          className="command-backdrop"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-title"
            className="command-dialog"
            initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5, scale: 0.99 }}
            transition={{ duration: 0.18 }}
            onKeyDown={handleDialogKey}
          >
            <div className="command-search">
              <Search size={18} aria-hidden="true" />
              <label htmlFor="command-input" className="sr-only" id="command-title">Search commands</label>
              <input
                ref={inputRef}
                id="command-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, projects, and actions..."
                autoComplete="off"
              />
              <button type="button" onClick={close} aria-label="Close command palette"><X size={16} /></button>
            </div>

            <div className="command-results" role="listbox" aria-label="Commands">
              {filtered.length ? groupOrder.map((group) => {
                const commands = filtered.filter((command) => command.group === group);
                if (!commands.length) return null;
                return (
                  <section key={group} className="command-group" aria-label={group}>
                    <p>{group}</p>
                    {commands.map((command) => {
                      const index = filtered.indexOf(command);
                      const Icon = command.icon;
                      return (
                        <button
                          key={command.id}
                          type="button"
                          role="option"
                          aria-selected={selected === index}
                          aria-disabled={command.disabled || undefined}
                          className={`${selected === index ? "is-selected" : ""} ${command.disabled ? "is-disabled" : ""}`}
                          onMouseEnter={() => setSelected(index)}
                          onClick={() => run(command)}
                        >
                          <Icon size={17} />
                          <span><strong>{command.label}</strong>{command.detail ? <small>{command.detail}</small> : null}</span>
                          {command.external ? <small>↗</small> : null}
                        </button>
                      );
                    })}
                  </section>
                );
              }) : <div className="command-empty">No matching command.</div>}
            </div>

            <footer className="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>Enter</kbd> Open</span><span><kbd>Esc</kbd> Close</span></footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
