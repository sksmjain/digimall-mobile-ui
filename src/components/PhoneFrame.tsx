import { useLocation } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import BottomNav from "./BottomNav";

type PhoneFrameProps = PropsWithChildren<{
  className?: string;
  bg?: string;
  screenBg?: string;
}>;

export default function PhoneFrame({
  children,
  className = "",
  bg = "bg-black",
  screenBg = "bg-white",
}: PhoneFrameProps) {
  const { pathname } = useLocation();
  const [tab, setTab] = useState<"home" | "orders" | "profile">("home");

  return (
    <div className={`min-h-screen w-full ${className}`}>
      {/* ---------- Mobile: full-screen app (no bezel) ---------- */}
      <div className="block md:hidden relative min-h-screen">
        <div
          id="phone-root"
          data-phone-root
          className={`relative min-h-screen w-full ${screenBg} overflow-hidden`}
        >
          {/* Scrollable content with space for fixed nav */}
          <div
            id="phone-scroll"
            key={pathname}
            className="min-h-screen w-full overflow-y-auto"
            style={{
              overscrollBehavior: "contain",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 88px)", // room for nav
            }}
          >
            {children}
          </div>

          {/* Mobile nav: fixed to viewport bottom */}
          <div
            className="fixed inset-x-0 bottom-0 z-50 md:hidden"
            style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
          >
            <BottomNav active={tab} onChange={setTab} />
          </div>
        </div>
      </div>

      {/* ---------- Desktop: phone shell + in-screen nav ---------- */}
      <div className="hidden md:grid place-items-center min-h-screen">
        <div
          className={`relative ${bg} rounded-[3.2rem] p-2 shadow-[0_30px_70px_rgba(0,0,0,0.35)] ring-1 ring-black/20`}
          style={{ width: 390, height: 780 }}
        >
          <div className="relative h-full w-full rounded-[2.6rem] bg-black/80 p-1">
            <div
              id="phone-root"
              data-phone-root
              className={`relative h-full w-full ${screenBg} rounded-[28px] overflow-hidden shadow-2xl`}
            >
              {/* notch */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 h-8 w-40 rounded-full bg-black/90" />

              {/* content area */}
              <div className="absolute inset-0 pt-12 pb-8">
                <div
                  id="phone-scroll"
                  key={pathname}
                  className="h-full w-full overflow-y-auto pb-20" // space for in-screen nav
                  style={{ overscrollBehavior: "contain" }}
                >
                  {children}
                </div>

                {/* home indicator */}
                <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-28 rounded-full bg-black/20" />
              </div>

              {/* Desktop nav: absolute inside phone screen */}
              <div className="hidden md:flex absolute left-3 right-3 bottom-3 z-50">
                <BottomNav active={tab} onChange={setTab} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
