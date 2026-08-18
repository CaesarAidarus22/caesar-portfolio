"use client";

import type { ReactNode } from "react";
import AskCaesar from "./AskCaesar";
import CommandPalette from "./CommandPalette";
import PageTransition from "./PageTransition";

export default function GlobalExperience({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AskCaesar />
      <CommandPalette />
      <PageTransition />
    </>
  );
}
