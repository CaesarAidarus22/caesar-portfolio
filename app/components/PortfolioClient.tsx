"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { featuredProjects, type Project, type ProjectAccent } from "@/app/data/projects";
import GithubActivity from "./GithubActivity";
import ContactSection from "./ContactSection";
import HomeProfileCard from "./HomeProfileCard";
import JourneySection from "./JourneySection";
import SiteNavbar from "./SiteNavbar";
import TechStackSection from "./TechStackSection";
import type { GithubActivityData } from "@/lib/github";

const credibility = [
  "AI Systems",
  "Data Mining",
  "Machine Learning",
  "Full Stack Development",
];

const projects = featuredProjects;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const accentStyles: Record<ProjectAccent, { label: string; border: string; wash: string; dot: string }> = {
  green: {
    label: "text-emerald-200",
    border: "border-emerald-300/15",
    wash: "from-emerald-500/12 via-transparent to-transparent",
    dot: "bg-emerald-300",
  },
  beige: {
    label: "text-stone-200",
    border: "border-stone-200/15",
    wash: "from-stone-300/12 via-transparent to-transparent",
    dot: "bg-stone-300",
  },
  blue: {
    label: "text-blue-200",
    border: "border-blue-300/15",
    wash: "from-blue-500/14 via-transparent to-transparent",
    dot: "bg-blue-300",
  },
  slate: { label: "text-slate-200", border: "border-slate-300/15", wash: "from-slate-500/12 via-transparent to-transparent", dot: "bg-slate-300" },
  purple: { label: "text-violet-200", border: "border-violet-300/15", wash: "from-violet-500/12 via-transparent to-transparent", dot: "bg-violet-300" },
  amber: { label: "text-amber-200", border: "border-amber-300/15", wash: "from-amber-500/12 via-transparent to-transparent", dot: "bg-amber-300" },
};

function ProjectAtmosphere({
  accent,
}: {
  accent: ProjectAccent;
}) {
  if (accent === "green") {
    return (
      <div aria-hidden="true" className="project-atmosphere project-atmosphere--green">
        <span className="eco-particle eco-particle--one" />
        <span className="eco-particle eco-particle--two" />
        <span className="scan-ring scan-ring--one" />
        <span className="scan-ring scan-ring--two" />
        <span className="species-indicator species-indicator--one">Lepidoptera</span>
      </div>
    );
  }

  if (accent === "beige") {
    return (
      <div aria-hidden="true" className="project-atmosphere project-atmosphere--beige">
        <span className="map-line map-line--one" />
        <span className="map-line map-line--two" />
        <span className="location-marker location-marker--one" />
        <span className="location-marker location-marker--two" />
        <span className="location-marker location-marker--three" />
        <span className="campus-node campus-node--one">Library</span>
        <span className="campus-node campus-node--two">Gate B</span>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="project-atmosphere project-atmosphere--blue">
        <span className="chat-bubble chat-bubble--one">Mood?</span>
        <span className="chat-bubble chat-bubble--two">Try this</span>
        <span className="typing-indicator typing-indicator--one">
          <span />
          <span />
          <span />
        </span>
        <span className="typing-indicator typing-indicator--two">
          <span />
          <span />
          <span />
        </span>
        <span className="conversation-wave conversation-wave--one" />
        <span className="conversation-wave conversation-wave--two" />
        <span className="conversation-pulse conversation-pulse--one" />
        <span className="conversation-pulse conversation-pulse--two" />
        <span className="recommendation-card recommendation-card--one">Focus playlist</span>
        <span className="recommendation-card recommendation-card--two">Quick game</span>
      </div>
  );
}

function PortfolioImage({
  src,
  alt,
  className = "",
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  );
}

function InteractiveMascot() {
  const [hovered, setHovered] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [hint, setHint] = useState("Hai, saya Caesar.");
  const pointerFrame = useRef<number | null>(null);
  const hintTimer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const seen = new Set<string>();
    const sections = [
      {
        id: "projects",
        key: "caesar-mascot-projects",
        message: "Ini beberapa project yang pernah saya bangun.",
      },
      {
        id: "github-activity",
        key: "caesar-mascot-github",
        message: "Lihat aktivitas pengembangan saya di GitHub.",
      },
    ];

    const observers = sections
      .map((section) => {
        const element = document.getElementById(section.id);
        if (!element || sessionStorage.getItem(section.key)) {
          return null;
        }

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting || seen.has(section.key)) {
              return;
            }

            seen.add(section.key);
            sessionStorage.setItem(section.key, "true");
            setHint(section.message);
            setHintVisible(true);
            if (hintTimer.current !== null) window.clearTimeout(hintTimer.current);
            hintTimer.current = window.setTimeout(() => setHintVisible(false), 4200);
          },
          { threshold: 0.35 },
        );

        observer.observe(element);
        return observer;
      })
      .filter(Boolean);

    return () => {
      observers.forEach((observer) => observer?.disconnect());
      if (hintTimer.current !== null) window.clearTimeout(hintTimer.current);
      if (pointerFrame.current !== null) window.cancelAnimationFrame(pointerFrame.current);
    };
  }, []);

  const openChat = () => window.dispatchEvent(new Event("open-ask-caesar"));

  return (
    <div
      className="ai-companion-shell"
      onPointerMove={(event) => {
        if (reduceMotion || event.pointerType !== "mouse") {
          return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = Math.max(-1, Math.min(1, (event.clientX - centerX) / 72));
        const y = Math.max(-1, Math.min(1, (event.clientY - centerY) / 72));
        const shell = event.currentTarget;

        if (pointerFrame.current !== null) {
          window.cancelAnimationFrame(pointerFrame.current);
        }

        pointerFrame.current = window.requestAnimationFrame(() => {
          shell.style.setProperty("--mascot-x", `${x * 5}px`);
          shell.style.setProperty("--mascot-y", `${y * 4}px`);
          shell.style.setProperty("--mascot-rotate", `${x * 3.5}deg`);
        });
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--mascot-x", "0px");
        event.currentTarget.style.setProperty("--mascot-y", "0px");
        event.currentTarget.style.setProperty("--mascot-rotate", "0deg");
        setHovered(false);
      }}
      onPointerEnter={() => setHovered(true)}
    >
      <AnimatePresence>
        {hovered || hintVisible ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="ai-companion-tooltip"
          >
            {hint}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        aria-label="Open Ask Caesar from mascot"
        onClick={openChat}
        className="ai-companion ai-companion--interactive"
      >
        <span className="ai-companion__halo" aria-hidden="true" />
        <Image
          src="/images/caesar-mascot.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 120px, (min-width: 640px) 96px, 80px"
          className="ai-companion__image"
        />
      </button>
    </div>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-5 pb-24 pt-32 sm:px-6 sm:pb-28 sm:pt-36 lg:min-h-screen lg:px-8 lg:pb-32"
    >
      <div className="cinematic-grid pointer-events-none absolute inset-0 -z-20" />
      <div
        aria-hidden="true"
        className="hero-noise pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="hero-depth pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="hero-spotlights pointer-events-none absolute inset-0 -z-10"
      >
        <span />
        <span />
        <span />
      </div>
      <div
        aria-hidden="true"
        className="hero-streaks pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="hero-particles pointer-events-none absolute inset-0 -z-10"
      >
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div
        aria-hidden="true"
        className="hero-light-sweep pointer-events-none absolute inset-y-0 right-0 -z-10 w-[52rem]"
      />
      <div
        aria-hidden="true"
        className="hero-portrait-spotlight pointer-events-none absolute right-[max(1rem,calc((100vw-72rem)/2))] top-32 -z-10 h-[36rem] w-[34rem]"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_70%_15%,rgba(6,69,196,0.18),transparent_32rem)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs uppercase tracking-[0.28em] text-secondary"
          >
            <Sparkles size={14} className="text-blue-300" />
            Software Engineer, AI & Data Mining Enthusiast
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-display text-[clamp(3.6rem,8vw,8.6rem)] font-semibold leading-[0.88] tracking-normal text-balance"
          >
            Muhammad
            <span className="block text-white/70">Caesar Aidarus</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.18, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-2xl font-display text-2xl leading-tight text-primary sm:text-3xl"
          >
            Building Intelligent Digital Experiences.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.26, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-2xl text-base leading-8 text-secondary sm:text-lg"
          >
            Saya adalah mahasiswa Informatika di Universitas Syiah Kuala dengan
            minat kuat pada Software Engineering, Artificial Intelligence, Data
            Mining, Machine Learning, Natural Language Processing, dan Computer
            Vision.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.34, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#projects"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background transition hover:bg-white"
            >
              View Projects
              <ArrowUpRight
                size={17}
                className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.035] px-6 py-3 text-sm font-semibold text-primary transition hover:border-white/24 hover:bg-white/[0.07]"
            >
              About Me
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.42, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {credibility.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-4 text-sm text-secondary backdrop-blur"
              >
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 22 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[31rem] lg:mr-0"
        >
          <div className="absolute -inset-10 rounded-[3.5rem] bg-[radial-gradient(circle_at_50%_8%,rgba(248,250,252,0.2),transparent_28%),radial-gradient(circle_at_50%_44%,rgba(6,69,196,0.18),transparent_48%)] blur-2xl" />
          <div className="absolute -bottom-8 left-10 right-10 h-24 rounded-full bg-black/65 blur-3xl" />
          <HomeProfileCard />
        </motion.div>
      </div>
    </section>
  );
}

function ProjectMockup({
  project,
  large = false,
}: {
  project: Project;
  large?: boolean;
}) {
  const style = accentStyles[project.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 42, scale: 0.96, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`project-mockup project-mockup--${project.accent} group relative ${
        large ? "mx-auto max-w-5xl" : ""
      }`}
    >
      <div
        className={`absolute -inset-8 rounded-[3rem] bg-gradient-to-br ${style.wash} blur-3xl transition duration-500 group-hover:opacity-90`}
      />
      <div
        className={`project-mockup__frame relative overflow-hidden rounded-[2rem] border ${style.border} bg-card shadow-cinematic transition duration-500`}
      >
        <div className="absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-white/[0.1] to-transparent" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,transparent_68%,rgba(5,6,8,0.34)_100%)] opacity-80" />
        <div className="relative aspect-[16/10] overflow-hidden">
          <PortfolioImage
            src={project.heroImage!}
            alt={`${project.title} laptop mockup`}
            sizes={large ? "80vw" : "(min-width: 1024px) 48vw, 92vw"}
            className="transition duration-700 group-hover:scale-[1.025]"
          />
        </div>
      </div>
    </motion.div>
  );
}

function ProjectStats({
  project,
  align = "left",
}: {
  project: Project;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ delay: 0.34, duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
      className={`mt-8 grid gap-3 sm:grid-cols-3 ${
        align === "center" ? "mx-auto max-w-3xl" : "max-w-xl"
      }`}
    >
      {(project.stats ?? []).map((stat) => (
        <div
          key={`${stat.value}-${stat.label}`}
          className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-4 backdrop-blur-md"
        >
          <p
            className={`font-display font-semibold leading-tight text-primary ${
              stat.label ? "text-2xl" : "text-sm sm:text-base"
            }`}
          >
            {stat.value}
          </p>
          {stat.label ? (
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-secondary">
              {stat.label}
            </p>
          ) : null}
        </div>
      ))}
    </motion.div>
  );
}

function ProjectContent({
  project,
  align = "left",
}: {
  project: Project;
  align?: "left" | "center";
}) {
  const style = accentStyles[project.accent];

  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : ""}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ delay: 0.18, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`font-display text-sm uppercase tracking-[0.32em] ${style.label}`}
        >
          {project.category}
        </div>
        <div
          className={`mt-5 flex items-start gap-5 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="font-display text-7xl font-semibold leading-none text-slate-200/20 sm:text-8xl">
            {project.number}
          </span>
          <h3 className="max-w-2xl font-display text-4xl font-semibold leading-[1.02] tracking-normal text-primary sm:text-5xl">
            {project.title}
          </h3>
        </div>
        <p
          className={`mt-7 text-base leading-8 text-secondary sm:text-lg ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-xl"
          }`}
        >
          {project.summary}
        </p>
        <div
          className={`mt-7 flex flex-wrap gap-2 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          {project.technologies.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-xs font-medium text-secondary"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>
      <ProjectStats project={project} align={align} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.42, duration: 0.55 }}
        className={`project-cta-row ${align === "center" ? "project-cta-row--center" : ""}`}
      >
        <Link href={`/projects/${project.slug}`} className="project-cta project-cta--primary">
          Case study <ArrowUpRight size={16} />
        </Link>
        {project.githubUrl ? (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-cta">
            <Github size={16} /> GitHub
          </a>
        ) : null}
      </motion.div>
    </div>
  );
}

function FeaturedProjects() {
  return (
    <section id="projects" className="relative px-5 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="font-display text-sm uppercase tracking-[0.32em] text-secondary">
            Featured Projects
          </p>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-primary sm:text-6xl">
            Sistem pilihan dari AI, data, automation, dan web.
          </h2>
        </motion.div>

        <div className="mt-20 space-y-12 sm:mt-24 sm:space-y-16">
          <article className="project-showcase project-showcase--green relative overflow-hidden rounded-[2.5rem] border border-white/10 px-5 py-8 sm:p-8 lg:p-10">
            <ProjectAtmosphere accent={projects[0].accent} />
            <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
              <ProjectMockup project={projects[0]} />
              <ProjectContent project={projects[0]} />
            </div>
          </article>

          <article className="project-showcase project-showcase--beige relative overflow-hidden rounded-[2.5rem] border border-white/10 px-5 py-8 sm:p-8 lg:p-10">
            <ProjectAtmosphere accent={projects[1].accent} />
            <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="lg:order-1">
                <ProjectContent project={projects[1]} />
              </div>
              <div className="lg:order-2">
                <ProjectMockup project={projects[1]} />
              </div>
            </div>
          </article>

          <article className="project-showcase project-showcase--blue relative overflow-hidden rounded-[2.5rem] border border-white/10 px-5 py-8 sm:p-8 lg:p-10">
            <ProjectAtmosphere accent={projects[2].accent} />
            <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
              <ProjectMockup project={projects[2]} />
              <ProjectContent project={projects[2]} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default function PortfolioClient({
  githubData,
}: {
  githubData: GithubActivityData | null;
}) {
  useEffect(() => {
    if (window.location.hash !== "#projects") {
      return;
    }

    const timer = window.setTimeout(() => {
      const target = document.getElementById("projects");
      if (target) {
        window.scrollTo({ top: target.offsetTop, behavior: "auto" });
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SiteNavbar />
      <Hero />
      <FeaturedProjects />
      <JourneySection />
      <TechStackSection />
      <GithubActivity data={githubData} />
      <ContactSection />
      <InteractiveMascot />
    </main>
  );
}
