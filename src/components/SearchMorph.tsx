// src/components/SearchMorph.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";

type Rect = { x: number; y: number; width: number; height: number };
type Variant = "capsule" | "panel";

type Props = {
  open: boolean;
  fromRect: Rect | null;
  onClose: () => void;
  placeholder?: string;

  /** "capsule" = 72px tall pill; "panel" = big rounded rectangle */
  variant?: Variant;

  /** Capsule sizing */
  capsuleHeight?: number; // default 72
  side?: number;          // horizontal margin
  bottomGap?: number;     // gap above bottom (adds to safe-area)

  /** Panel sizing */
  panelWidth?: number | "auto"; // default "auto" (auto = clamp to container with side)
  panelHeight?: number;         // default 300
  panelRadius?: number;         // default 28
};

export default function SearchMorph({
  open,
  fromRect,
  onClose,
  placeholder = "Search products",
  variant = "capsule",

  capsuleHeight = 72,
  side = 16,
  bottomGap = 12,

  panelWidth = "auto",
  panelHeight = 300,
  panelRadius = 28,
}: Props) {
  const overlayRoot =
    (typeof document !== "undefined" &&
      (document.getElementById("overlay-root") as HTMLElement)) || document.body;

  const sheetRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Align start with button even if page scrolled
  const safeRect = useMemo(() => {
    if (!fromRect) return null;
    const y = fromRect.y - (window.scrollY || 0);
    return { ...fromRect, y };
  }, [fromRect]);

  // Track iOS keyboard so morph stays bottom-anchored
  useEffect(() => {
    if (!open) return;
    const vv = (window as any).visualViewport;
    if (!vv || !sheetRef.current) return;
    const onResize = () => {
      sheetRef.current!.style.setProperty(
        "--kb-offset",
        `${Math.max(0, (window.innerHeight - vv.height))}px`
      );
    };
    onResize();
    vv.addEventListener?.("resize", onResize);
    return () => vv.removeEventListener?.("resize", onResize);
  }, [open]);

  // Lock background scroll during overlay
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Open animation
  useEffect(() => {
    if (!open || !safeRect || !glassRef.current || !scrimRef.current || !sheetRef.current) return;

    const ease = "cubic-bezier(.2,.8,.2,1)";
    const dur  = 360;

    // scrim
    scrimRef.current!.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: dur, easing: ease, fill: "forwards",
    });

    const rootRect = sheetRef.current!.getBoundingClientRect();

    // target frame (depends on variant)
    let targetX = 0, targetY = 0, targetW = 0, targetH = 0, radius = 999;

    if (variant === "capsule") {
      targetW = Math.min(rootRect.width - side * 2, 680);
      targetH = capsuleHeight;
      targetX = (rootRect.width - targetW) / 2;
      targetY = rootRect.height - targetH - bottomGap;
      radius  = 999;
    } else {
      const innerSide = side;
      targetW = panelWidth === "auto" ? rootRect.width - innerSide * 2 : Math.min(Number(panelWidth), rootRect.width - innerSide * 2);
      targetH = Math.min(panelHeight, rootRect.height - 120); // keep some headroom
      targetX = (rootRect.width - targetW) / 2;
      targetY = rootRect.height - targetH - bottomGap;
      radius  = panelRadius;
    }

    const translateTo = `translate(${targetX}px, calc(${targetY}px - var(--safe-bot, 0px) - var(--kb-offset, 0px)))`;

    // ensure safe-area bottom is available
    sheetRef.current!.style.setProperty("--safe-bot", `env(safe-area-inset-bottom, 0px)`);

    const anim = glassRef.current!.animate(
      [
        {
          transform: `translate(${safeRect.x}px, ${safeRect.y}px)`,
          width: `${safeRect.width}px`,
          height: `${safeRect.height}px`,
          borderRadius: "28px",
          opacity: 0.98,
        },
        {
          transform: translateTo,
          width: `${targetW}px`,
          height: `${targetH}px`,
          borderRadius: `${radius}px`,
          opacity: 1,
        },
      ],
      { duration: dur, easing: ease, fill: "forwards" }
    );

    anim.finished.then(() => {
      // micro-overshoot
      glassRef.current!.animate(
        [
          { transform: `${translateTo} scale(1.00)` },
          { transform: `${translateTo} scale(1.03)` },
          { transform: `${translateTo} scale(1.00)` },
        ],
        { duration: 220, easing: "cubic-bezier(.2,.9,.1,1)", fill: "forwards" }
      );
      // sheen sweep
      sheenRef.current?.animate(
        [
          { transform: "translateX(-120%)", opacity: 0 },
          { transform: "translateX(0%)", opacity: 0.45, offset: 0.5 },
          { transform: "translateX(120%)", opacity: 0 },
        ],
        { duration: 700, easing: "ease", fill: "forwards" }
      );
      // focus only for capsule; panel may include more UI but we still focus by default
      inputRef.current?.focus();
      try { (navigator as any)?.vibrate?.(6); } catch {}
    });

    return () => anim.cancel();
  }, [open, safeRect, variant, capsuleHeight, panelHeight, panelWidth, panelRadius, side, bottomGap]);

  const close = () => {
    if (!glassRef.current || !scrimRef.current || !safeRect) return onClose();
    const ease = "cubic-bezier(.2,.8,.2,1)";
    const dur  = 240;
    const rect = glassRef.current.getBoundingClientRect();

    const a1 = glassRef.current.animate(
      [
        {
          transform: `translate(${rect.x}px, ${rect.y}px)`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          borderRadius: getComputedStyle(glassRef.current).borderRadius,
          opacity: 1,
        },
        {
          transform: `translate(${safeRect.x}px, ${safeRect.y}px)`,
          width: `${safeRect.width}px`,
          height: `${safeRect.height}px`,
          borderRadius: "28px",
          opacity: 0.98,
        },
      ],
      { duration: dur, easing: ease, fill: "forwards" }
    );

    const a2 = scrimRef.current.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: dur, easing: ease, fill: "forwards",
    });

    a1.onfinish = onClose;
    a2.onfinish = null;
  };

  if (!open) return null;

  const isPanel = variant === "panel";

  const node = (
    <div ref={sheetRef} className="absolute inset-0 z-[95] pointer-events-auto" >
      {/* scrim w/ vignette */}
      <div
        ref={scrimRef}
        className="absolute inset-0 opacity-0"
        onClick={close}
        style={{
          background:
            "radial-gradient(120% 100% at 50% 100%, rgba(0,0,0,.55) 0%, rgba(0,0,0,.42) 35%, rgba(0,0,0,.22) 65%, rgba(0,0,0,.10) 100%)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Glass object (capsule or panel) */}
      <div
        ref={glassRef}
        className={`
          absolute overflow-hidden
          bg-white/82 ring-1 ring-black/10 backdrop-blur-2xl
          shadow-[0_28px_80px_rgba(0,0,0,0.28)]
          ${isPanel ? "p-4" : "flex items-center gap-3 px-4"}
        `}
        style={{ width: 1, height: 1, borderRadius: isPanel ? 28 : 999 }}
      >
        {/* Inner content */}
        {isPanel ? (
          <div className="relative w-full h-full">
            {/* small notch line at top like the video */}
            {/* <div className="absolute left-1/2 -translate-x-1/2 top-2 h-[3px] w-16 rounded-full bg-white/50" /> */}
            <div className="flex items-center gap-3">
              <Search className="h-6 w-6 text-black/60" />
              <input
                ref={inputRef}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none text-[16px] placeholder-black/55"
              />
              <button
                onClick={close}
                className="grid h-9 w-9 place-items-center rounded-full bg-black/5"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-black/70" />
              </button>
            </div>

            {/* Panel body placeholder (suggestions, categories, etc.) */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {["Hoodies", "Sweatpants", "Puffer", "Crewnecks"].map((t) => (
                <div
                  key={t}
                  className="rounded-xl ring-1 ring-black/10 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm font-medium text-black/70"
                >
                  {t}
                </div>
              ))}
            </div>

            {/* sheen sweep */}
            <div
              ref={sheenRef}
              className="pointer-events-none absolute inset-y-0 w-1/2 -left-1/4"
              style={{
                background:
                  "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.55) 50%, rgba(255,255,255,0) 100%)",
                filter: "blur(6px)",
                mixBlendMode: "soft-light",
              }}
            />
          </div>
        ) : (
          <>
            <Search className="h-6 w-6 text-black/60" />
            <input
              ref={inputRef}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-[16px] placeholder-black/55"
            />
            <div
              ref={sheenRef}
              className="pointer-events-none absolute inset-y-0 w-1/2 -left-1/4"
              style={{
                background:
                  "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.55) 50%, rgba(255,255,255,0) 100%)",
                filter: "blur(6px)",
                mixBlendMode: "soft-light",
              }}
            />
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full bg-black/5"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-black/70" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(node, overlayRoot);
}
