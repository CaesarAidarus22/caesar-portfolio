"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { journeyItems } from "@/app/data/journey";
import { getProject } from "@/app/data/projects";

export default function JourneySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const observers = itemRefs.current.map((element, index) => {
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index);
        },
        { rootMargin: "-35% 0px -45%", threshold: 0.15 },
      );
      observer.observe(element);
      return observer;
    });

    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  return (
    <section id="experience" className="journey-section" aria-labelledby="journey-title">
      <div className="journey-heading">
        <p>Journey</p>
        <h2 id="journey-title">Learning by building.</h2>
        <span>
          Perjalanan akademik, eksperimen teknis, dan project yang membuat setiap
          ide menjadi lebih konkret.
        </span>
      </div>

      <div className="journey-timeline">
        <div className="journey-line" aria-hidden="true">
          <span style={{ transform: `scaleY(${(activeIndex + 1) / journeyItems.length})` }} />
        </div>

        {journeyItems.map((item, index) => (
          <motion.article
            key={item.period}
            ref={(element) => { itemRefs.current[index] = element; }}
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className={`journey-item ${activeIndex === index ? "journey-item--active" : ""}`}
          >
            <div className="journey-item__period">{item.period}</div>
            <div className="journey-item__marker" aria-hidden="true"><span /></div>
            <div className="journey-item__content">
              <p>{item.type}</p>
              <h3>{item.title}</h3>
              <span>{item.description}</span>
              <div className="journey-item__tech">
                {item.technologies.map((technology) => <i key={technology}>{technology}</i>)}
              </div>
              <div className="journey-item__projects">
                {item.projectSlugs.map((slug) => {
                  const project = getProject(slug);
                  return project ? (
                    <Link key={slug} href={`/projects/${slug}`}>
                      {project.shortTitle} <ArrowUpRight size={14} />
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
