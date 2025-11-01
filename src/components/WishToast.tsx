import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Heart } from "lucide-react";

export type WishToastPayload = {
  id?: string | number;
  title: string;
  image: string;
};

type WishToastProps = {
  open: boolean;
  onClose: () => void;
  item?: WishToastPayload | null;
  duration?: number; // ms
};

export default function WishToast({ open, onClose, item, duration = 1400 }: WishToastProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // ✅ Resolve the phone screen root only after mount (avoids body fallback)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const find = () =>
      (document.getElementById("phone-root") as HTMLElement) ||
      (document.querySelector("[data-phone-root]") as HTMLElement) ||
      null;

    // try now
    let target = find();
    if (target) {
      setContainer(target);
      return;
    }

    // try on next frame (PhoneFrame might mount after this component)
    const id = requestAnimationFrame(() => {
      target = find();
      if (target) setContainer(target);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  // Animate in/out with Web Animations API
  useEffect(() => {
    const el = boxRef.current;
    if (!el || !open) return;

    try {
      if ("vibrate" in navigator) (navigator as any).vibrate(8);
    } catch {}

    const ease = "cubic-bezier(.2,.8,.2,1)";
    const aIn = el.animate(
      [
        { transform: "translateY(12px) scale(.98)", opacity: 0 },
        { transform: "translateY(0) scale(1.02)", opacity: 1, offset: 0.82 },
        { transform: "translateY(0) scale(1)", opacity: 1 },
      ],
      { duration: 240, easing: ease, fill: "forwards" }
    );

    const t = window.setTimeout(() => {
      const aOut = el.animate(
        [
          { transform: "translateY(0) scale(1)", opacity: 1 },
          { transform: "translateY(10px) scale(.98)", opacity: 0 },
        ],
        { duration: 180, easing: ease, fill: "forwards" }
      );
      aOut.onfinish = () => onClose();
    }, duration);

    return () => {
      aIn.cancel();
      clearTimeout(t);
    };
  }, [open, onClose, duration]);

  // Don’t render until we have a valid container (prevents page-bottom fallback)
  if (!open || !item || !container) return null;

  const node = (
    <div
      // Use fixed inside the phone root so it floats over content and BottomNav
      className="fixed left-1/2 -translate-x-1/2 z-[70] pointer-events-none w-70"
      // Sit just above BottomNav, while respecting safe-area on real phones
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        ref={boxRef}
        className="pointer-events-auto flex items-center gap-3 rounded-full bg-white/90 backdrop-blur-xl
                   ring-1 ring-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] px-3.5 py-2 flex justify-between"
      >
        <div className="flex gap-2">
          <img
            src={item.image}
            alt=""
            className="h-9 w-9 rounded-full object-cover ring-1 ring-black/10"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] text-left text-black/60">Added to wishlist</span>
            <span className="text-[14px] text-left font-medium text-black line-clamp-1">{item.title}</span>
          </div>
        </div>
        <div className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-black text-white">
          <Heart className="h-4 w-4 fill-current" />
        </div>
      </div>
    </div>
  );

  return createPortal(node, container);
}
