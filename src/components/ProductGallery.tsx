import React, { useEffect, useRef, useState } from "react";

interface ProductGalleryProps {
  images: string[];
  aspect?: number; // width/height ratio, default 3/4 phone-ish
  className?: string;
}

export default function ProductGallery({
  images,
  aspect = 3 / 4,
  className = "",
}: ProductGalleryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Track the slide closest to the center of the viewport
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { left, width } = el.getBoundingClientRect();
        const mid = left + width / 2;

        let idx = 0;
        let best = Number.POSITIVE_INFINITY;
        Array.from(el.children).forEach((child, i) => {
          const r = (child as HTMLElement).getBoundingClientRect();
          const dist = Math.abs(r.left + r.width / 2 - mid);
          if (dist < best) {
            best = dist;
            idx = i;
          }
        });
        setActive(idx);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    // trigger once
    onScroll();

    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={className}>
      <div
        ref={scrollerRef}
        className="
          relative flex gap-3 overflow-x-auto snap-x snap-mandatory
          px-1 pb-1 scrollbar-hide ios-momentum
        "
        style={{ scrollBehavior: "smooth" }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className={`
              snap-center shrink-0 rounded-xl overflow-hidden ring-1 ring-black/10 bg-white
              transition-transform transition-opacity duration-300 ease-out
              ${i === active ? "scale-100 opacity-100" : "scale-[0.96] opacity-90"}
            `}
            style={{
              width: "100%",            // full width of container
              aspectRatio: `${aspect}`, // keeps height consistent
            }}
          >
            <img
              src={src}
              alt={`Product ${i + 1}`}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
