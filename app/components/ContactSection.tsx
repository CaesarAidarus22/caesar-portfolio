"use client";

import { ArrowUpRight, Github, Linkedin, MessageCircle } from "lucide-react";
import { socialLinks } from "@/app/data/socialLinks";

export default function ContactSection() {
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="contact-section__copy">
        <p>Contact</p>
        <h2 id="contact-title">Let&apos;s connect.</h2>
        <span>
          Punya ide, project, atau ingin berdiskusi tentang teknologi? Hubungi
          saya melalui GitHub, LinkedIn, atau Ask Caesar.
        </span>
      </div>
      <div className="contact-section__actions">
        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
          <Github size={18} /> GitHub <ArrowUpRight size={16} />
        </a>
        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin size={18} /> LinkedIn <ArrowUpRight size={16} />
        </a>
        <button type="button" onClick={() => window.dispatchEvent(new Event("open-ask-caesar"))}>
          <MessageCircle size={18} /> Ask Caesar
        </button>
      </div>
    </section>
  );
}
