"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { generateResponse } from "@/lib/chatbot/generateResponse";
import type { ChatAction, ChatContext } from "@/lib/chatbot/types";
import { site } from "@/lib/site";
import { useApp } from "./Providers";
import { EASE } from "./ui";

const MAX_INPUT = 500;
const MAX_QUESTIONS = 20; // per sesi (state; hilang saat reload)

type Message = { id: number; role: "assistant" | "user"; content: string; actions?: ChatAction[] };

// ikon inline (pengganti lucide-react)
const IconX = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const Avatar = ({ size }: { size: string }) => (
  <Image src="/images/caesar-mascot.webp" alt="" width={256} height={256} sizes={size} className="h-full w-full object-cover" />
);

export default function AskCaesar() {
  const { t, locale, ready } = useApp();
  const a = t.ask;
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const context = useRef<ChatContext>({});
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  const asked = messages.filter((m) => m.role === "user").length;
  const limitReached = asked >= MAX_QUESTIONS;
  const label = a.launcher; // label jujur: tanpa "AI" selama mode AI tidak aktif

  // fokus ke input saat dibuka, kembali ke tombol saat ditutup
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (wasOpen.current) {
      launcherRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, reduce]);

  const ask = (raw: string) => {
    const q = raw.trim().slice(0, MAX_INPUT);
    if (!q || limitReached) return;
    const res = generateResponse(q, locale, context.current);
    context.current = res.context;
    const id = Date.now();
    setMessages((m) => [...m, { id, role: "user", content: q }, { id: id + 1, role: "assistant", content: res.text, actions: res.actions }]);
    setInput("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  // jebakan fokus sederhana agar Tab tidak keluar dari dialog modal
  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], textarea:not([disabled])");
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      {/* launcher: tersembunyi selama preloader; z di atas nav (50), di bawah kursor (90) & preloader (100) */}
      <AnimatePresence>
        {ready && (
          <motion.div
            // saat panel terbuka launcher disembunyikan (tetap terpasang agar fokus bisa kembali ke sini)
            className={`group fixed bottom-5 right-5 z-[70] md:bottom-7 md:right-7 ${open ? "pointer-events-none" : ""}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: open ? 0 : 1, scale: open ? 0.6 : 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <button
              ref={launcherRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label={label}
              aria-haspopup="dialog"
              aria-expanded={open}
              className="relative block h-14 w-14 rounded-full bg-blush shadow-[0_10px_30px_-8px_rgba(17,17,17,0.45)] ring-[3px] ring-white transition-transform duration-300 hover:scale-105 md:h-16 md:w-16"
            >
              <span className="block h-full w-full overflow-hidden rounded-full">
                <Avatar size="64px" />
              </span>
              <span className="absolute right-0.5 top-0.5 flex h-3 w-3" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-brand ring-2 ring-white" />
              </span>
            </button>
            <span
              className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs text-white opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
              aria-hidden
            >
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ask-caesar-title"
            onKeyDown={trapFocus}
            className="fixed inset-x-0 bottom-0 z-[75] flex h-[85svh] flex-col overflow-hidden rounded-t-3xl bg-base text-ink shadow-[0_-10px_40px_-10px_rgba(17,17,17,0.35)] ring-1 ring-line md:inset-x-auto md:bottom-7 md:right-7 md:h-[min(600px,calc(100svh-7rem))] md:w-[380px] md:rounded-3xl"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <header data-theme="brand" className="flex items-center gap-3 bg-brand px-4 py-3 text-white">
              <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-blush ring-2 ring-white/70">
                <Avatar size="40px" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="ask-caesar-title" className="font-serif text-2xl leading-none">
                  {a.title}
                </h2>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] opacity-95">{a.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={a.close}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
              >
                <IconX />
              </button>
            </header>

            {/* data-lenis-prevent: scroll di sini tidak dibajak Lenis */}
            <div ref={scrollRef} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
              <Bubble role="assistant">{a.welcome}</Bubble>
              {messages.map((m) => (
                <Bubble key={m.id} role={m.role} youLabel={a.you}>
                  {m.content}
                  {m.actions?.length ? (
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {m.actions.map((act) => (
                        <a
                          key={act.href}
                          href={act.href}
                          target={act.external ? "_blank" : undefined}
                          rel={act.external ? "noopener noreferrer" : undefined}
                          onClick={() => !act.external && setOpen(false)}
                          className="inline-flex items-center gap-1 rounded-full border border-ink/20 bg-base px-2.5 py-1 text-xs transition-colors hover:border-brand hover:bg-brand hover:text-white"
                        >
                          {act.label} <IconArrow />
                        </a>
                      ))}
                    </span>
                  ) : null}
                </Bubble>
              ))}
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {a.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="rounded-full border border-line px-3 py-1.5 text-left text-[13px] transition-colors hover:border-brand hover:bg-brand hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {limitReached && (
                <p className="rounded-2xl border border-dashed border-line p-3 text-sm text-muted">
                  {a.limit}{" "}
                  <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-2">
                    LinkedIn ↗
                  </a>
                </p>
              )}
            </div>

            <form onSubmit={submit} className="border-t border-line p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-line bg-surface p-1.5 pl-3 focus-within:border-ink/40">
                <label htmlFor="ask-caesar-input" className="sr-only">
                  {a.inputLabel}
                </label>
                <textarea
                  ref={inputRef}
                  id="ask-caesar-input"
                  rows={1}
                  value={input}
                  maxLength={MAX_INPUT}
                  disabled={limitReached}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      ask(input);
                    }
                  }}
                  placeholder={a.placeholder}
                  className="max-h-28 min-h-[2.25rem] flex-1 resize-none bg-transparent py-2 text-[15px] outline-none placeholder:text-muted disabled:opacity-50"
                />
                <button
                  type="submit"
                  aria-label={a.send}
                  disabled={!input.trim() || limitReached}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-brand disabled:opacity-30 disabled:hover:bg-ink"
                >
                  <IconSend />
                </button>
              </div>
              {input.length > MAX_INPUT - 100 && (
                <p className="mt-1 px-1 text-right font-mono text-[10px] text-muted">
                  {MAX_INPUT - input.length} {a.charsLeft}
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, youLabel, children }: { role: Message["role"]; youLabel?: string; children: React.ReactNode }) {
  const user = role === "user";
  return (
    <div className={`flex ${user ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
          user ? "rounded-br-md bg-ink text-white" : "rounded-bl-md bg-blush text-ink"
        }`}
      >
        {user && youLabel ? <span className="sr-only">{youLabel}: </span> : null}
        {children}
      </div>
    </div>
  );
}
