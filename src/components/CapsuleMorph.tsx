// src/components/SearchMorph.tsx
import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";

type Rect = { x: number; y: number; width: number; height: number };

export default function CapsuleMorph({
  open,
  fromRect,
  placeholder = "Search products",
  onClose,
  height = 72,                        // 👈 big capsule height
  side = 16,                           // horizontal margin
  bottomGap = 16,                      // gap above bottom (adds to safe-area)
}: {
  open: boolean;
  fromRect: Rect | null;
  placeholder?: string;
  onClose: () => void;
  height?: number;
  side?: number;
  bottomGap?: number;
}) {
  const overlayRoot =
    (typeof document !== "undefined" &&
      (document.getElementById("overlay-root") as HTMLElement)) || document.body;

  const sheetRef = useRef<HTMLDivElement>(null);
  const capRef   = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Align animation start with the button even if the page is scrolled.
  const safeRect = useMemo(() => {
    if (!fromRect) return null;
    const y = fromRect.y - (window.scrollY || 0);
    return { ...fromRect, y };
  }, [fromRect]);

  // Track keyboard on iOS to keep the capsule kissing the bottom.
  useEffect(() => {
    if (!open) return;
    const vv = (window as any).visualViewport;
    if (!vv || !sheetRef.current) return;
    const onResize = () => {
      (sheetRef.current as HTMLElement).style.setProperty(
        "--kb-offset",
        `${Math.max(0, (window.innerHeight - vv.height))}px`
      );
    };
    onResize();
    vv.addEventListener?.("resize", onResize);
    return () => vv.removeEventListener?.("resize", onResize);
  }, [open]);

  // Lock background scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Open animation
  useEffect(() => {
    if (!open || !safeRect || !capRef.current || !scrimRef.current) return;

    const ease = "cubic-bezier(.2,.8,.2,1)";
    const dur  = 360;

    // scrim fade
    scrimRef.current!.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: dur, easing: ease, fill: "forwards",
    });

    // compute bottom target frame
    const rootRect = sheetRef.current!.getBoundingClientRect();
    const targetW  = Math.min(rootRect.width - side * 2, 680);
    const targetH  = height;
    const targetX  = (rootRect.width - targetW) / 2;
    const targetY  =
      rootRect.height - targetH - bottomGap; // from top of root
    // we pull it up by safe-area+keyboard via CSS var
    const translateTo = `translate(${targetX}px, calc(${targetY}px - var(--safe-bot,0px) - var(--kb-offset,0px)))`;

    // and set safe-area var once
    const envInset = getComputedStyle(document.documentElement).getPropertyValue("env(safe-area-inset-bottom)") || "0px";
    const tmp = document.createElement("div");
    tmp.style.bottom = `calc(${envInset} + 0px)`; // force evaluation
    sheetRef.current!.style.setProperty("--safe-bot", `env(safe-area-inset-bottom, 0px)`);

    const cap = capRef.current!.animate(
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
          borderRadius: "999px",
          opacity: 1,
        },
      ],
      { duration: dur, easing: ease, fill: "forwards" }
    );

    cap.finished.then(() => {
      // micro-overshoot
      capRef.current!.animate(
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
      inputRef.current?.focus();
      try { (navigator as any)?.vibrate?.(6); } catch {}
    });

    return () => cap.cancel();
  }, [open, safeRect, side, height, bottomGap]);

  const close = () => {
    if (!capRef.current || !scrimRef.current || !safeRect) return onClose();
    const ease = "cubic-bezier(.2,.8,.2,1)";
    const dur  = 240;
    const rect = capRef.current.getBoundingClientRect();

    const a1 = capRef.current.animate(
      [
        {
          transform: `translate(${rect.x}px, ${rect.y}px)`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          borderRadius: "999px",
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

  const node = (
    <div ref={sheetRef} className="absolute inset-0 z-[95] pointer-events-auto">
      {/* scrim with soft vignette; click to close */}
      <div
        ref={scrimRef}
        className="absolute inset-0 opacity-0"
        onClick={close}
        style={{
          background:
            "radial-gradient(120% 100% at 50% 100%, rgba(0,0,0,.55) 0%, rgba(0,0,0,.22) 35%, rgba(0,0,0,.22) 65%, rgba(0,0,0,.10) 100%)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* bottom-anchored glass capsule */}
      <div
        ref={capRef}
        className="absolute flex items-center gap-3 px-4
                   rounded-sm bg-white/82 ring-1 ring-black/10
                   shadow-[0_28px_80px_rgba(0,0,0,0.28)]
                   backdrop-blur-2xl"
        style={{ width: 1, height: 1 }}
      >
        <Search className="h-6 w-6 text-black/60" />
        <input
          ref={inputRef}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-[16px] placeholder-black/55"
        />
        {/* sheen */}
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
        {/* close */}
        <button
          onClick={close}
          className="grid h-9 w-9 place-items-center rounded-full bg-black/5"
          aria-label="Close search"
        >
          <X className="h-5 w-5 text-black/70" />
        </button>
      </div>
    </div>
  );

  return createPortal(node, overlayRoot);
}
