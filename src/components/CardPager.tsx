// CardPager.tsx
import React, { useEffect, useRef, useState } from "react";

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

type Props = {
  items: CardItem[];
  initialIndex?: number;
  onIndexChange?: (i: number) => void;
  className?: string;
  /** drag threshold as % of viewport height (0.18 = 18%) */
  swipeThreshold?: number;
};

export default function CardPager({
  items,
  initialIndex = 0,
  onIndexChange,
  className = "",
  swipeThreshold = 0.18,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [dragY, setDragY] = useState(0); // live drag offset for current card
  const [isDragging, setDragging] = useState(false);
  const startYRef = useRef(0);
  const vh = useVh();

  // keep current/prev/next in memory
  const prev = items[index - 1];
  const curr = items[index];
  const next = items[index + 1];

  // autoplay visible video
  useEffect(() => {
    const vids = document.querySelectorAll("[data-cardpager-video]") as NodeListOf<HTMLVideoElement>;
    vids.forEach((v) => {
      const cellIndex = Number(v.dataset.cellIndex);
      if (cellIndex === index) v.play().catch(() => {});
      else v.pause();
    });
  }, [index]);

  // drag handlers (mouse + touch)
  const onStart = (y: number) => {
    startYRef.current = y;
    setDragging(true);
  };
  const onMove = (y: number) => {
    if (!isDragging) return;
    setDragY(y - startYRef.current);
  };
  const onEnd = () => {
    if (!isDragging) return;
    const delta = dragY;
    const threshold = vh * swipeThreshold;
    setDragging(false);

    if (delta <= -threshold && next) {
      // swipe UP to next
      animateTo(-vh, () => {
        setIndex((i) => i + 1);
        setDragY(0);
        onIndexChange?.(index + 1);
      });
    } else if (delta >= threshold && prev) {
      // swipe DOWN to prev
      animateTo(vh, () => {
        setIndex((i) => i - 1);
        setDragY(0);
        onIndexChange?.(index - 1);
      });
    } else {
      // revert
      animateTo(0, () => setDragY(0));
    }
  };

  // attach global listeners for mouse/touch
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => onStart(e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientY);
    const onTouchEnd = () => onEnd();

    const onMouseDown = (e: MouseEvent) => onStart(e.clientY);
    const onMouseMove = (e: MouseEvent) => onMove(e.clientY);
    const onMouseUp = () => onEnd();

    const host = hostRef.current;
    if (!host) return;

    host.addEventListener("touchstart", onTouchStart, { passive: true });
    host.addEventListener("touchmove", onTouchMove, { passive: true });
    host.addEventListener("touchend", onTouchEnd);
    host.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      host.removeEventListener("touchstart", onTouchStart);
      host.removeEventListener("touchmove", onTouchMove);
      host.removeEventListener("touchend", onTouchEnd);
      host.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, dragY, prev, next, vh]);

  // small polish: haptic when index changes
  useEffect(() => {
    try {
      (navigator as any)?.vibrate?.(8);
    } catch {}
  }, [index]);

  // computed transforms
  const currY = clamp(dragY, -vh, vh);
  const nextY = vh + currY; // pulled up as you drag up
  const prevY = -vh + currY; // pulled down as you drag down
  const pullingUp = currY < 0;
  const pullingDown = currY > 0;

  const currScale = 1 - Math.min(Math.abs(currY) / (vh * 2.2), 0.04); // shrink a touch while dragging
  const neighborScale = 0.96 + Math.min(Math.abs(currY) / (vh * 3), 0.04); // next/prev grow in a bit

  return (
    <div
      ref={hostRef}
      className={`relative h-[100dvh] w-full bg-neutral-100 overflow-hidden ${className}`}
      // hide the phone dock padding for this page if you use a CSS var
      style={{ ["--nav-space" as any]: "0px" }}
    >
      {/* Prev card (above) */}
      {prev && (
        <CardShell
          item={prev}
          style={{
            transform: `translateY(${prevY}px) scale(${pullingDown ? neighborScale : 0.96})`,
            zIndex: 10,
            opacity: 1,
          }}
          cellIndex={index - 1}
        />
      )}

      {/* Current card */}
      {curr && (
        <CardShell
          item={curr}
          style={{
            transform: `translateY(${currY}px) scale(${currScale})`,
            zIndex: 20,
            opacity: 1,
            cursor: isDragging ? "grabbing" : "grab",
          }}
          active
          cellIndex={index}
        />
      )}

      {/* Next card (below) */}
      {next && (
        <CardShell
          item={next}
          style={{
            transform: `translateY(${nextY}px) scale(${pullingUp ? neighborScale : 0.96})`,
            zIndex: 10,
            opacity: 1,
          }}
          cellIndex={index + 1}
        />
      )}
    </div>
  );

  /** animate the current card to a Y destination with easing, then callback */
  function animateTo(destY: number, done: () => void) {
    const start = dragY;
    const duration = 260;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic
    const startTs = performance.now();

    const step = (now: number) => {
      const p = Math.min(1, (now - startTs) / duration);
      const y = start + (destY - start) * ease(p);
      setDragY(y);
      if (p < 1) requestAnimationFrame(step);
      else done();
    };
    requestAnimationFrame(step);
  }
}

/* ------------ helpers + shells ------------ */

function useVh() {
  const [vh, setVh] = useState<number>(
    typeof window !== "undefined" ? window.innerHeight : 800
  );
  useEffect(() => {
    const on = () => setVh(window.innerHeight);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vh;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function CardShell({
  item,
  style,
  active = false,
  cellIndex,
}: {
  item: CardItem;
  style?: React.CSSProperties;
  active?: boolean;
  cellIndex: number;
}) {
  return (
    <section
      className={`
        absolute left-0 right-0 mx-auto
        w-full max-w-[560px]
        will-change-transform
        p-4
      `}
      style={{
        top: `0`,
        height: `100dvh`,
        ...style,
      }}
    >
      <div
        className={`
          relative h-full w-full overflow-hidden bg-white
          rounded-[12px] ring-1 ring-black/10
          ${active
            ? "shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
            : "shadow-[0_10px_30px_rgba(0,0,0,0.14)]"}
      `}
      >
        {/* Media */}
        {(item.kind ?? "image") === "video" && item.videoSrc ? (
          <div className="relative h-[54%] w-full bg-black overflow-hidden">
            <video
              data-cardpager-video
              data-cell-index={cellIndex}
              src={item.videoSrc}
              poster={item.poster}
              className="absolute inset-0 h-full w-full object-cover"
              playsInline
              muted
              loop
              preload="metadata"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent" />
          </div>
        ) : (
          <div className="relative h-[54%] w-full bg-black overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-white/60">
                No image
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent" />
          </div>
        )}

        {/* Body */}
        <article className="px-4 py-4">
          {item.source && (
            <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-[12px] font-medium text-black/80 ring-1 ring-black/10">
              {item.source}
            </span>
          )}
          <h2 className="mt-2 text-[20px] font-semibold leading-[1.25]">
            {item.title}
          </h2>
          {item.summary && (
            <p className="mt-2 text-[15px] leading-6 text-black/70">
              {item.summary}
            </p>
          )}
          {item.ctaLabel && (
            <div className="mt-3">
              <button className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow">
                {item.ctaLabel}
              </button>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
