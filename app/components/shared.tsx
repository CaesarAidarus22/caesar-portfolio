import Image from "next/image";

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const easeOutExpo = [0.22, 1, 0.36, 1] as const;

export function PortfolioImage({
  src,
  alt,
  className = "",
  sizes,
  priority = false,
  unoptimized = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  unoptimized?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      unoptimized={unoptimized}
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  );
}
