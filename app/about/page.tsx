import type { Metadata } from "next";
import AboutPageClient from "@/app/components/about/AboutPageClient";

export const metadata: Metadata = {
  title: "About | Muhammad Caesar Aidarus",
  description:
    "Kenali Muhammad Caesar Aidarus, mahasiswa Informatika yang mengeksplorasi Software Engineering, Artificial Intelligence, data, dan teknologi kreatif.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
