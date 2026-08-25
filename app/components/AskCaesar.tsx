"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Send, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState, type PointerEvent } from "react";
import { generateResponse } from "@/lib/chatbot/generateResponse";
import type { ChatAction, ChatContext, ChatLanguage, ChatLanguageMode } from "@/lib/chatbot/types";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  language?: ChatLanguage;
  actions?: ChatAction[];
};

const welcome: Message = {
  id: 0,
  role: "assistant",
  content: "Hi! I'm Caesar's portfolio assistant. Ask me anything about Caesar.\n\nHai! Saya asisten portfolio Caesar. Tanyakan apa saja tentang Caesar.",
};

const suggestions: Record<ChatLanguageMode, readonly string[]> = {
  auto: [
    "Siapa Caesar?",
    "What has Caesar built?",
    "Skill utamanya apa?",
    "What tech stack does he use?",
    "Lihat aktivitas GitHub",
    "Contact Caesar",
  ],
  id: [
    "Caesar itu siapa?",
    "Project Caesar apa saja?",
    "Skill utamanya apa?",
    "Tech stack yang digunakan?",
    "Project AI Caesar?",
    "Lihat aktivitas GitHub",
    "Bagaimana menghubungi Caesar?",
  ],
  en: [
    "Who is Caesar?",
    "What has Caesar built?",
    "What are his main skills?",
    "What tech stack does he use?",
    "What AI projects has he built?",
    "View GitHub activity",
    "How can I contact Caesar?",
  ],
};

const placeholders: Record<ChatLanguageMode, string> = {
  auto: "Tanya / ask about Caesar...",
  id: "Tanya tentang project, skill, atau kontak...",
  en: "Ask about projects, skills, or contact...",
};

function AskCaesarLauncher({
  onOpen,
  reduceMotion,
}: {
  onOpen: () => void;
  reduceMotion: boolean;
}) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [topDocked, setTopDocked] = useState(false);
  const pointerFrame = useRef<number | null>(null);
  const pathname = usePathname();
  const needsMobileTopDock = pathname === "/about" || pathname.startsWith("/projects/");

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const updateDock = () => {
      setTopDocked(needsMobileTopDock && mobileQuery.matches && window.scrollY < 96);
    };

    updateDock();
    window.addEventListener("scroll", updateDock, { passive: true });
    mobileQuery.addEventListener("change", updateDock);

    return () => {
      window.removeEventListener("scroll", updateDock);
      mobileQuery.removeEventListener("change", updateDock);
    };
  }, [needsMobileTopDock]);

  useEffect(
    () => () => {
      if (pointerFrame.current !== null) {
        window.cancelAnimationFrame(pointerFrame.current);
      }
    },
    [],
  );

  const resetPosition = (launcher: HTMLDivElement) => {
    launcher.style.setProperty("--mascot-x", "0px");
    launcher.style.setProperty("--mascot-y", "0px");
    launcher.style.setProperty("--mascot-rotate", "0deg");
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") {
      return;
    }

    const launcher = event.currentTarget;
    const rect = launcher.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = Math.max(-1, Math.min(1, (event.clientX - centerX) / 72));
    const y = Math.max(-1, Math.min(1, (event.clientY - centerY) / 72));

    if (pointerFrame.current !== null) {
      window.cancelAnimationFrame(pointerFrame.current);
    }

    pointerFrame.current = window.requestAnimationFrame(() => {
      launcher.style.setProperty("--mascot-x", `${x * 5}px`);
      launcher.style.setProperty("--mascot-y", `${y * 4}px`);
      launcher.style.setProperty("--mascot-rotate", `${x * 3.5}deg`);
    });
  };

  return (
    <div
      className={`ai-companion-shell${topDocked ? " ai-companion-shell--top-docked" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setTooltipVisible(true)}
      onPointerLeave={(event) => {
        resetPosition(event.currentTarget);
        setTooltipVisible(false);
      }}
    >
      <AnimatePresence>
        {tooltipVisible ? (
          <motion.span
            id="ask-caesar-launcher-tooltip"
            role="tooltip"
            initial={reduceMotion ? false : { opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="ai-companion-tooltip"
          >
            Ask Caesar
          </motion.span>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        aria-label="Open Ask Caesar"
        aria-describedby={tooltipVisible ? "ask-caesar-launcher-tooltip" : undefined}
        aria-expanded="false"
        className="ai-companion ai-companion--interactive"
        onClick={onOpen}
        onFocus={() => setTooltipVisible(true)}
        onBlur={() => setTooltipVisible(false)}
      >
        <span className="ai-companion__halo" aria-hidden="true" />
        <Image
          src="/images/caesar-mascot.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 96px, (min-width: 641px) 84px, 60px"
          className="ai-companion__image"
        />
      </button>
    </div>
  );
}

export default function AskCaesar() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ChatLanguageMode>("auto");
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const contextRef = useRef<ChatContext>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const show = () => {
      window.dispatchEvent(new Event("close-command-palette"));
      setOpen(true);
    };
    const close = () => setOpen(false);
    window.addEventListener("open-ask-caesar", show);
    window.addEventListener("close-ask-caesar", close);
    return () => {
      window.removeEventListener("open-ask-caesar", show);
      window.removeEventListener("close-ask-caesar", close);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    document.documentElement.classList.toggle("ask-caesar-is-open", open);
    return () => document.documentElement.classList.remove("ask-caesar-is-open");
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    const response = generateResponse(trimmed, mode, contextRef.current);
    contextRef.current = response.context;
    const id = Date.now();
    setMessages((current) => [
      ...current,
      { id, role: "user", content: trimmed },
      {
        id: id + 1,
        role: "assistant",
        content: response.text,
        language: response.language,
        actions: response.actions,
      },
    ]);
    setInput("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    ask(input);
  };

  return (
    <>
      {!open ? (
        <AskCaesarLauncher
          onOpen={() => {
            window.dispatchEvent(new Event("close-command-palette"));
            setOpen(true);
          }}
          reduceMotion={Boolean(reduceMotion)}
        />
      ) : null}

      <AnimatePresence>
        {open ? (
          <motion.aside
            role="dialog"
            aria-modal="false"
            aria-labelledby="ask-caesar-title"
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="ask-caesar-panel"
          >
            <header className="ask-caesar-header">
              <span className="ask-caesar-avatar"><Image src="/images/caesar-mascot.png" alt="" fill sizes="42px" /></span>
              <div><strong id="ask-caesar-title">Ask Caesar</strong><small>Portfolio Assistant</small></div>
              <div className="ask-language-toggle" aria-label="Response language">
                {(["auto", "id", "en"] as const).map((languageMode) => (
                  <button
                    key={languageMode}
                    type="button"
                    aria-pressed={mode === languageMode}
                    className={mode === languageMode ? "is-active" : ""}
                    onClick={() => setMode(languageMode)}
                  >
                    {languageMode.toUpperCase()}
                  </button>
                ))}
              </div>
              <button type="button" className="ask-caesar-close" aria-label="Close Ask Caesar" onClick={() => setOpen(false)}><X size={17} /></button>
            </header>

            <div ref={scrollRef} className="ask-caesar-messages" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`ask-message ask-message--${message.role}`} lang={message.language}>
                  <span>{message.role === "assistant" ? "CA" : "YOU"}</span>
                  <p>{message.content}</p>
                  {message.actions?.length ? (
                    <div className="ask-message__actions">
                      {message.actions.map((item) => (
                        <a
                          key={`${message.id}-${item.href}`}
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          onClick={() => { if (!item.external) setOpen(false); }}
                        >
                          {item.label} <ArrowUpRight size={13} />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              {messages.length === 1 ? (
                <div className="ask-suggestions" aria-label="Suggested questions">
                  {suggestions[mode].map((question) => <button key={question} type="button" onClick={() => ask(question)}>{question}</button>)}
                </div>
              ) : null}
            </div>

            <form className="ask-caesar-form" onSubmit={submit}>
              <label htmlFor="ask-caesar-input" className="sr-only">Ask a question about Caesar</label>
              <input ref={inputRef} id="ask-caesar-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={placeholders[mode]} autoComplete="off" />
              <button type="submit" aria-label="Send question" disabled={!input.trim()}><Send size={16} /></button>
            </form>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
