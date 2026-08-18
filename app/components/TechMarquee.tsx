import type { TechStackItem } from "@/app/data/techStack";
import TechPill from "./TechPill";

export default function TechMarquee({
  technologies,
  direction,
  row,
}: {
  technologies: TechStackItem[];
  direction: "left" | "right";
  row: 1 | 2;
}) {
  return (
    <div
      className={`tech-marquee tech-marquee--${direction} tech-marquee--row-${row}`}
      role="list"
      aria-label={`Technology row ${row}`}
    >
      <div className="tech-marquee__track">
        <div className="tech-marquee__group">
          {technologies.map((technology) => (
            <TechPill key={technology.name} technology={technology} />
          ))}
        </div>
        <div className="tech-marquee__group" aria-hidden="true">
          {technologies.map((technology) => (
            <TechPill
              key={`${technology.name}-duplicate`}
              technology={technology}
              duplicate
            />
          ))}
        </div>
      </div>
    </div>
  );
}

