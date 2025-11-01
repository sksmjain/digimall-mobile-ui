import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Heart } from "lucide-react";

export type WishToastPayload = {
  title: string;
  image: string;
};

type WishToastProps = {
  open: boolean;
  onClose: () => void;
  item?: WishToastPayload | null;
  // how long it stays visible
  duration?: number; // ms
};

export default function WishToast({ open, onClose, item, duration = 1400 }: WishToastProps) {
  // mount inside the phone’s rounded screen
  const phoneRoot =
    (typeof document !== "undefined" &&
      (document.querySelector("[data-phone-root]") as HTMLElement)) || document.body;

  const boxRef = useRef<HTMLDivElement>(null);

  // animate in/out with Web Animations (feels smoother than CSS-only)
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    if (!open) return;

    // haptic (best-effort)
    if ("vibrate" in navigator) try { navigator.vibrate(8); } catch {}

    const dur = 260;
    const ease = "cubic-bezier(.2,.8,.2,1)";

    // in: translateY + slight overshoot scale
    const aIn = el.animate(
      [
        { transform: "translateY(12px) scale(.98)", opacity: 0 },
        { transform: "translateY(0) scale(1.02)", opacity: 1, offset: 0.82 },
        { transform: "translateY(0) scale(1)", opacity: 1 },
      ],
      { duration: dur, easing: ease, fill: "forwards" }
    );

    let outTimer: number | undefined;
    let closeTimer: number | undefined;

    // auto-dismiss
    outTimer = window.setTimeout(() => {
      const aOut = el.animate(
        [
          { transform: "translateY(0) scale(1)", opacity: 1 },
          { transform: "translateY(10px) scale(.98)", opacity: 0 },
        ],
        { duration: 200, easing: ease, fill: "forwards" }
      );
      aOut.onfinish = () => onClose();
    }, duration);

    return () => {
      aIn.cancel();
      if (outTimer) window.clearTimeout(outTimer);
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  }, [open, onClose, duration]);

  if (!open || !item) return null;

  const node = (
    <div
      className="absolute inset-x-0 bottom-20 flex justify-center pointer-events-none z-[60]"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        ref={boxRef}
        className="pointer-events-auto flex items-center gap-3 rounded-full bg-white/90 backdrop-blur-xl
                   ring-1 ring-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] px-3.5 py-2"
      >
        <img
          src={item.image}
          alt=""
          className="h-9 w-9 rounded-full object-cover ring-1 ring-black/10"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] text-black/60">Added to wishlist</span>
          <span className="text-[14px] font-medium text-black line-clamp-1">{item.title}</span>
        </div>
        <div className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-black text-white">
          <Heart className="h-4 w-4 fill-current" />
        </div>
      </div>
    </div>
  );

  return createPortal(node, phoneRoot);
}
