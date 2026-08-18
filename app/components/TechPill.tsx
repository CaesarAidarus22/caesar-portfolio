import type { CSSProperties } from "react";
import type { TechStackItem } from "@/app/data/techStack";

export default function TechPill({
  technology,
  duplicate = false,
}: {
  technology: TechStackItem;
  duplicate?: boolean;
}) {
  const Icon = technology.icon;
  const style = { "--tech-color": technology.brandColor } as CSSProperties;

  return (
    <div
      className="tech-pill"
      style={style}
      tabIndex={duplicate ? -1 : 0}
      role="listitem"
      aria-label={`${technology.name}, ${technology.category}: ${technology.shortDescription}`}
    >
      <Icon className="tech-pill__icon" aria-hidden="true" />
      <span className="tech-pill__name">{technology.name}</span>
      <span className="tech-pill__tooltip" role="tooltip">
        <strong>{technology.name}</strong>
        <small>{technology.shortDescription}</small>
      </span>
    </div>
  );
}

