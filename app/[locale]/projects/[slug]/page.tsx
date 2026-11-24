import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import ProjectView from "@/components/ProjectView";
import { getProject, projects } from "@/lib/projects";
import { locales, type Locale } from "@/lib/site";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: p.summary[locale as Locale], openGraph: p.image ? { images: [p.image] } : undefined };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return (
    <>
      <Nav />
      <ProjectView slug={slug} />
      <Contact />
    </>
  );
}
