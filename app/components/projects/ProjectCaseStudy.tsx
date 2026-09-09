import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Project } from "@/app/data/projects";
import SiteNavbar from "../SiteNavbar";

function StorySection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="case-story-section">
      <div className="case-story-section__label">
        <span>{number}</span>
        {title}
      </div>
      <div className="case-story-section__content">{children}</div>
    </section>
  );
}

export default function ProjectCaseStudy({
  project,
  previous,
  next,
}: {
  project: Project;
  previous?: Project;
  next?: Project;
}) {
  const style = { "--case-accent": project.accentColor } as CSSProperties;

  return (
    <main className={`case-page case-page--${project.accent}`} style={style}>
      <SiteNavbar />
      <div className="case-page__grid" aria-hidden="true" />

      <header className="case-hero">
        <div className="case-hero__copy">
          <Link href="/#projects" className="case-back-link">
            <ArrowLeft size={16} /> Back to projects
          </Link>
          <div className="case-hero__eyebrow">
            <span>{project.number}</span>
            {project.category}
          </div>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="case-tech-list" aria-label="Technologies used">
            {project.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
          <div className="case-hero__actions">
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github size={17} /> View repository <ArrowUpRight size={16} />
              </a>
            ) : null}
            <Link href="/#projects">All projects</Link>
          </div>
        </div>

        <div className={`case-visual case-visual--${project.accent}`}>
          {project.heroImage ? (
            <Image
              src={project.heroImage}
              alt={`${project.title} project interface`}
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 92vw"
              className={`case-visual__image ${project.slug === "sahamradar" ? "case-visual__image--contain" : ""}`}
            />
          ) : (
            <div className="case-visual__placeholder" aria-label={`${project.title} visual identity`}>
              <span>{project.number}</span>
              <strong>{project.shortTitle}</strong>
              <small>{project.category}</small>
            </div>
          )}
        </div>
      </header>

      <div className="case-body">
        <section className="case-overview" aria-labelledby="case-overview-title">
          <div>
            <p className="case-section-kicker">01 — Overview</p>
            <h2 id="case-overview-title">Dibangun dari masalah yang jelas menjadi sistem yang bekerja.</h2>
          </div>
          <div className="case-overview__details">
            <p>{project.description ?? project.summary}</p>
            <dl>
              {project.role ? <div><dt>Role</dt><dd>{project.role}</dd></div> : null}
              {project.year ? <div><dt>Year</dt><dd>{project.year}</dd></div> : null}
              <div><dt>Type</dt><dd>{project.category}</dd></div>
            </dl>
            {project.status ? <p className="case-status">{project.status}</p> : null}
          </div>
        </section>

        {project.problem ? (
          <StorySection number="02" title="The problem"><p>{project.problem}</p></StorySection>
        ) : null}
        {project.solution ? (
          <StorySection number="03" title="The solution"><p>{project.solution}</p></StorySection>
        ) : null}
        {project.features?.length ? (
          <StorySection number="04" title="Key features">
            <ul className="case-feature-grid">
              {project.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </StorySection>
        ) : null}
        {project.architecture?.length ? (
          <StorySection number="05" title="System / data flow">
            <ol className="case-architecture">
              {project.architecture.map((item, index) => (
                <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>
              ))}
            </ol>
          </StorySection>
        ) : null}
        {project.technologies.length ? (
          <StorySection number="06" title="Tech stack">
            <div className="case-tech-list" aria-label="Project technology and capability stack">
              {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
            </div>
          </StorySection>
        ) : null}
        {project.engineeringContribution ? (
          <StorySection number="07" title="Engineering contribution"><p>{project.engineeringContribution}</p></StorySection>
        ) : null}
        {project.showcase && project.heroImage ? (
          <StorySection number="08" title="Project showcase">
            <p>{project.showcase}</p>
            <div className="case-showcase-image">
              <Image src={project.heroImage} alt={`${project.title} full project showcase`} fill sizes="(min-width: 1024px) 62vw, 92vw" />
            </div>
          </StorySection>
        ) : null}
        {project.challenges?.length ? (
          <StorySection number="09" title="Challenges">
            <ul className="case-challenge-list">
              {project.challenges.map((challenge) => <li key={challenge}>{challenge}</li>)}
            </ul>
          </StorySection>
        ) : null}
        {project.results ? (
          <StorySection number="08" title="Outcome"><p>{project.results}</p></StorySection>
        ) : null}
        {project.lessons ? (
          <StorySection number="10" title="What I learned"><p>{project.lessons}</p></StorySection>
        ) : null}

        <nav className="case-project-nav" aria-label="Project case studies">
          {previous ? <Link href={`/projects/${previous.slug}`}>
            <span><ArrowLeft size={17} /> Previous project</span>
            <strong>{previous.shortTitle}</strong>
          </Link> : <span aria-hidden="true" />}
          {next ? <Link href={`/projects/${next.slug}`}>
            <span>Next project <ArrowRight size={17} /></span>
            <strong>{next.shortTitle}</strong>
          </Link> : null}
        </nav>
      </div>
    </main>
  );
}
