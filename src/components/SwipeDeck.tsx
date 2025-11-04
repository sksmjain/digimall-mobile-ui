import { useEffect, useMemo, useRef, useState } from "react";

/** One item can be a video or an image */
export type DeckItem = {
  id: string | number;
  kind: "video" | "image";
  src: string;
  poster?: string;      // for videos (optional)
  caption?: string;     // small text overlay
};

type SwipeDeckProps = {
  items: DeckItem[];
  className?: string;
  /** Called when the active page changes */
  onIndexChange?: (i: number) => void;
  /** Start index (default 0) */
  initialIndex?: number;
};

export default function SwipeDeck({
  items,
  className = "",
  onIndexChange,
  initialIndex = 0,
}: SwipeDeckProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(initialIndex);

  // Ensure we start scrolled to initialIndex once mounted
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const child = el.children[initialIndex] as HTMLElement | undefined;
    if (child) child.scrollIntoView({ block: "start" });
  }, [initialIndex]);

  // Observe which snap pane is most visible → set active
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const panes = Array.from(root.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        // pick the one with largest intersection ratio
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const idx = panes.findIndex((p) => p === best.target);
        if (idx >= 0 && idx !== active) {
          setActive(idx);
          onIndexChange?.(idx);
        }
      },
      {
        root,
        threshold: [0.5, 0.75, 0.95], // require large visibility
      }
    );

    panes.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, [active, onIndexChange]);

  // Play/pause visible videos only
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const videos = root.querySelectorAll("video") as NodeListOf<HTMLVideoElement>;
    videos.forEach((v, idx) => {
      if (idx === active) {
        // best-effort autoplay
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = Math.min(v.currentTime, v.duration || v.currentTime);
      }
    });
  }, [active]);

  // Reduce motion preference → disable snap animation (still snap)
  const prefersReducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    []
  );

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* Vertical snap container */}
      <div
        ref={containerRef}
        className={`
          absolute inset-0
          overflow-y-scroll scrollbar-hide ios-momentum
          snap-y snap-mandatory
          ${prefersReducedMotion ? "" : "scroll-smooth"}
          touch-pan-y
        `}
      >
        {items.map((it, i) => (
          <section
            key={it.id}
            className={`
              relative h-full min-h-[100dvh] snap-start
              bg-black
            `}
          >
            {/* Media */}
            <div className="absolute inset-0">
              {it.kind === "video" ? (
                <video
                  src={it.src}
                  poster={it.poster}
                  className="absolute inset-0 h-full w-full object-cover"
                  playsInline
                  muted
                  loop
                  preload="metadata"
                />
              ) : (
                <img
                  src={it.src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={i <= 2 ? "eager" : "lazy"}
                />
              )}
              {/* gradient for legibility */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Overlay UI (right rail actions like TikTok) */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 text-white">
              <button className="grid h-12 w-12 place-items-center rounded-full bg-white/15 backdrop-blur ring-1 ring-white/20">
                {/* ♥ icon – replace with your lucide icon if you want */}
                <span className="text-xl">♥</span>
              </button>
              <button className="grid h-12 w-12 place-items-center rounded-full bg-white/15 backdrop-blur ring-1 ring-white/20">
                <span className="text-xl">💬</span>
              </button>
              <button className="grid h-12 w-12 place-items-center rounded-full bg-white/15 backdrop-blur ring-1 ring-white/20">
                <span className="text-xl">↗</span>
              </button>
            </div>

            {/* Caption / meta */}
            {(it.caption ?? "") && (
              <div className="absolute left-3 right-20 bottom-6 text-white">
                <p className="text-[15px] leading-6">{it.caption}</p>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Hint pill (optional) */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-3 h-1.5 w-24 rounded-full bg-white/20" />
    </div>
  );
}
