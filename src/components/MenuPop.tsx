// src/components/MenuPop.tsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Store, PlusCircle, ThumbsDown, AlertCircle, Star } from "lucide-react";

type MenuPopProps = {
  open: boolean;
  onClose: () => void;
  logo?: string;
  shopName?: string;
  rating?: number;
  ratingCount?: string;
  onVisitShop?: () => void;
  onFollow?: () => void;
  onNotInterested?: () => void;
  onReport?: () => void;
};

export default function MenuPop({
  open,
  onClose,
  logo = "https://dummyimage.com/96x96/eee/aaa&text=Logo",
  shopName = "Carpe",
  rating = 4.1,
  ratingCount = "13.5K",
  onVisitShop,
  onFollow,
  onNotInterested,
  onReport,
}: MenuPopProps) {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Resolve overlay root after mount so we never fall back to document.body
  useEffect(() => {
    const find = () =>
      (document.getElementById("overlay-root") as HTMLElement) ||
      (document.querySelector("[data-overlay-root]") as HTMLElement) ||
      (document.getElementById("phone-root") as HTMLElement) ||
      (document.querySelector("[data-phone-root]") as HTMLElement) ||
      null;

    let target = find();
    if (target) setRoot(target);
    else requestAnimationFrame(() => setRoot(find()));
  }, []);

  // Open/close animations
  useEffect(() => {
    const el = sheetRef.current;
    const bg = backdropRef.current;
    if (!el || !bg) return;

    const ease = "cubic-bezier(.2,.8,.2,1)";
    if (open) {
      bg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: "forwards", easing: ease });
      el.animate(
        [{ transform: "translateY(24px)", opacity: 0.85 }, { transform: "translateY(0)", opacity: 1 }],
        { duration: 220, fill: "forwards", easing: ease }
      );
      try { (navigator as any)?.vibrate?.(6); } catch {}
    } else {
      bg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards", easing: ease });
      el.animate(
        [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(24px)", opacity: 0.92 }],
        { duration: 170, fill: "forwards", easing: ease }
      );
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!root || !open) return null;

  const Row = ({
    icon, label, danger, onClick,
  }: { icon: React.ReactNode; label: string; danger?: boolean; onClick?: () => void }) => (
    <button
      onClick={() => { onClick?.(); onClose(); }}
      className={`w-full flex items-center gap-4 px-5 py-2 text-left rounded-2xl transition
                  hover:bg-black/[.03] ${danger ? "text-red-600" : "text-black"}`}
    >
      <div className={`grid h-9 w-9 place-items-center rounded-xl ${danger ? "bg-red-50 text-red-600" : "bg-black/5 text-black"}`}>
        {icon}
      </div>
      <span className="text-[17px] font-medium">{label}</span>
    </button>
  );

  return createPortal(
    // Wrapper anchored to phone screen (NOT the page)
    <div className="absolute inset-0 z-[95] pointer-events-none flex items-end">
      {/* Backdrop catches taps */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/40 pointer-events-auto"
        onClick={onClose}
      />

      {/* Bottom sheet — max 1/3 screen, scrolls inside if needed */}
      <div
        ref={sheetRef}
        className="
          pointer-events-auto
          absolute inset-x-2
          rounded-[28px] bg-white shadow-2xl ring-1 ring-black/10
          overflow-hidden flex flex-col
        "
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
          maxHeight: "50vh",
        }}
      >
        <div className="overflow-auto">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/5"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 px-5 pt-6 pb-4">
            <img src={logo} alt="" className="h-14 w-14 rounded-2xl object-cover bg-neutral-200" />
            <div>
              <p className="text-[20px] text-left font-semibold leading-6">{shopName}</p>
              <div className="mt-0.5 flex items-center gap-1.5 text-[15px] text-black/80">
                <span>{rating.toFixed(1)}</span>
                <Star className="h-4 w-4 fill-current" />
                <span>({ratingCount})</span>
              </div>
            </div>
          </div>

          <div className="mx-5 h-px bg-black/10" />

          {/* Actions */}
          <div className="mt-2 flex flex-col gap-1 pb-3">
            <Row icon={<Store className="h-5 w-5" />} label="Visit shop" onClick={onVisitShop} />
            <Row icon={<PlusCircle className="h-5 w-5" />} label="Follow" onClick={onFollow} />
            <Row icon={<ThumbsDown className="h-5 w-5" />} label="Not interested" onClick={onNotInterested} />
            <Row icon={<AlertCircle className="h-5 w-5" />} label="Report shop" danger onClick={onReport} />
          </div>
        </div>
      </div>
    </div>,
    root
  );
}
