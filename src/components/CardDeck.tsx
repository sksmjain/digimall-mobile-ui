import { useEffect, useMemo, useRef, useState } from "react";

export type CardItem = {
  id: string | number;
  title: string;
  summary?: string;
  image?: string;
  kind?: "image" | "video";
  videoSrc?: string;
  poster?: string;
  source?: string;
  ctaLabel?: string;
};

type CardDeckProps = {
  items: CardItem[];
  className?: string;
  initialIndex?: number;
  onIndexChange?: (i: number) => void;
};

export default function CardDeck({
  items,
  className = "",
  initialIndex = 0,
  onIndexChange,
}: CardDeckProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(initialIndex);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const child = root.children[initialIndex] as HTMLElement | undefined;
    if (child) child.scrollIntoView({ block: "start" });
    setActive(initialIndex);
  }, [initialIndex]);

  // observe which card is most visible
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const panes = Array.from(root.children) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const idx = panes.findIndex((p) => p === best.target);
        if (idx >= 0 && idx !== active) {
          setActive(idx);
          onIndexChange?.(idx);
          try {
            (navigator as any)?.vibrate?.(6);
          } catch {}
        }
      },
      { root, threshold: [0.5, 0.75, 0.95] }
    );

    panes.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, [active, onIndexChange]);

  // only play visible video
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const videos = root.querySelectorAll("video") as NodeListOf<HTMLVideoElement>;
    videos.forEach((v, idx) => {
      if (idx === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  // preload neighbors
  useEffect(() => {
    const preload = (src?: string) => {
      if (!src) return;
      const img = new Image();
      img.src = src;
    };
    preload(items[active + 1]?.image || items[active + 1]?.poster);
    preload(items[active - 1]?.image || items[active - 1]?.poster);
  }, [active, items]);

  return (
    <div
      className={`relative h-[100dvh] w-full ${className}`}
      style={{ ["--nav-space" as any]: "0px" }} // no dock padding
    >
      {/* subtle background so cards feel detached */}
      <div
        ref={rootRef}
        className={`
          absolute inset-0 bg-neutral-100
          overflow-y-scroll scrollbar-hide ios-momentum
          snap-y snap-mandatory
          ${prefersReducedMotion ? "" : "scroll-smooth"}
          touch-pan-y
        `}
      >
        {items.map((it, i) => {
          const isActive = i === active;
          return (
            <section
              key={it.id}
              className="relative snap-start min-h-[100dvh] grid place-items-center px-1"
            >
              {/* Card shell */}
              <div
                className={`relative w-full max-w-[560px] h-[88vh]
                  rounded-[18px] overflow-hidden bg-white
                  ring-1 ring-black/10
                  transition-all duration-300 will-change-transform
                  ${isActive
                    ? "scale-100 shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
                    : "scale-[0.98] opacity-95 shadow-[0_8px_26px_rgba(0,0,0,0.12)]"
                  }`}
              >
                {/* Media */}
                {(it.kind ?? "image") === "video" && it.videoSrc ? (
                  <div className="relative h-[54vh] w-full overflow-hidden bg-black">
                    <video
                      src={it.videoSrc}
                      poster={it.poster}
                      className="absolute inset-0 h-full w-full object-cover"
                      playsInline
                      muted
                      loop
                      preload="metadata"
                    />
                  </div>
                ) : (
                  <div className="relative h-[54vh] w-full overflow-hidden bg-black">
                    {it.image ? (
                      <img
                        src={it.image}
                        alt={it.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading={i <= 2 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-white/60">
                        No image
                      </div>
                    )}
                    {/* Top gradient (helps legibility when titles overlap media edge) */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/20 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <article className="px-4 py-4">
                  {it.source && (
                    <span className="inline-flex items-center rounded-xs bg-black/5 px-1 py-1 text-[12px] font-medium text-black/80 ring-1 ring-black/10">
                      {it.source}
                    </span>
                  )}

                  <h2 className="mt-2 text-[20px] font-semibold leading-[1.25]">
                    {it.title}
                  </h2>

                  {it.summary && (
                    <p className="mt-2 text-[15px] leading-6 text-black/70">
                      {it.summary}
                    </p>
                  )}

                  {it.ctaLabel && (
                    <div className="mt-3">
                      <button className="rounded-xs bg-black px-4 py-2 text-sm font-semibold text-white shadow">
                        {it.ctaLabel}
                      </button>
                    </div>
                  )}
                </article>

                {/* Divider gradient between media and body */}
                <div className="pointer-events-none absolute inset-x-0 top-[54vh] h-6 bg-gradient-to-b from-black/10 to-transparent" />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
