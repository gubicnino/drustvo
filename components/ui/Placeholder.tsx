import { cn } from "@/lib/utils";

/*
  Intentional SVG landscape placeholder. Deterministic per `seed`, so each hike
  gets a distinct (but on-brand) mountain scene. Swap for real photos later by
  setting a hike's `image` — see HikeImage below.
*/

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const PALETTES = [
  { sky: ["#dff0e4", "#bfe0cc"], far: "#9cc6ae", mid: "#5b9e78", near: "#2f6b4a", ink: "#14532d" },
  { sky: ["#e7f1da", "#c8e0b4"], far: "#a7c489", mid: "#6f9e57", near: "#436b32", ink: "#1f4d22" },
  { sky: ["#fdeecf", "#f6d9a8"], far: "#cdbf8e", mid: "#7d9a6a", near: "#3f6b4a", ink: "#14532d" },
  { sky: ["#dfeaf2", "#bcd2e0"], far: "#9fbac9", mid: "#5e8c86", near: "#2f6b58", ink: "#0f4d3f" },
];

export function Placeholder({
  seed = "pohod",
  className,
  showSun = true,
}: {
  seed?: string;
  className?: string;
  showSun?: boolean;
}) {
  const h = hash(seed);
  const p = PALETTES[h % PALETTES.length];
  const id = `ph-${(h % 100000).toString(36)}`;
  // Deterministic ridge offsets
  const o1 = (h % 40) - 20;
  const o2 = ((h >> 3) % 50) - 25;
  const o3 = ((h >> 6) % 30) - 15;
  const sunX = 140 + (h % 480);

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Slika pohoda (nadomestna)"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="100%" stopColor={p.sky[1]} />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill={`url(#${id}-sky)`} />
      {showSun && <circle cx={sunX} cy="150" r="46" fill="#fff7e6" opacity="0.85" />}
      {showSun && <circle cx={sunX} cy="150" r="46" fill={p.far} opacity="0.12" />}

      {/* Far ridge */}
      <path
        fill={p.far}
        d={`M0 ${360 + o1} L120 ${300 + o2} L260 ${350 + o1} L400 ${280 + o3} L560 ${340 + o2} L700 ${300 + o1} L800 ${340} L800 600 L0 600 Z`}
        opacity="0.85"
      />
      {/* Mid ridge */}
      <path
        fill={p.mid}
        d={`M0 ${430 + o2} L160 ${360 + o3} L320 ${420 + o1} L470 ${350 + o2} L640 ${410 + o3} L800 ${360} L800 600 L0 600 Z`}
        opacity="0.92"
      />
      {/* Near ridge */}
      <path
        fill={p.near}
        d={`M0 ${500 + o3} L200 ${440 + o1} L380 ${500 + o2} L560 ${430 + o1} L740 ${490 + o3} L800 ${460} L800 600 L0 600 Z`}
      />
      {/* Snow caps on near peaks */}
      <path fill="#ffffff" opacity="0.6" d={`M180 ${452 + o1} l20 -12 l20 14 l-18 6 z`} />
      <path fill="#ffffff" opacity="0.5" d={`M540 ${442 + o1} l22 -12 l22 16 l-20 6 z`} />
    </svg>
  );
}

/**
 * Renders a real uploaded image when `src` is set, otherwise the SVG placeholder.
 * (Uses a plain <img> so /uploads files work without next.config tweaks; switch
 * to next/image once real assets and dimensions are in place.)
 */
export function HikeImage({
  src,
  alt,
  seed,
  className,
  showSun = true,
}: {
  src?: string;
  alt: string;
  seed: string;
  className?: string;
  showSun?: boolean;
}) {
  if (src && src.trim() !== "") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return <Placeholder seed={seed} className={className} showSun={showSun} />;
}
