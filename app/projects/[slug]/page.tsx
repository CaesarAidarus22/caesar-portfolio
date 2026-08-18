import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectCaseStudy from "@/app/components/projects/ProjectCaseStudy";
import { getAdjacentProjects, getProject, projects } from "@/app/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found | Muhammad Caesar Aidarus" };
  }

  return {
    title: `${project.title} | Muhammad Caesar Aidarus`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      images: project.heroImage ? [{ url: project.heroImage }] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const { previous, next } = getAdjacentProjects(slug);
  return <ProjectCaseStudy project={project} previous={previous} next={next} />;
}
