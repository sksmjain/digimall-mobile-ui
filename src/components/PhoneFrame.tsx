import { useLocation } from "react-router-dom";
import { useState, PropsWithChildren } from "react";
import BottomNav from "./BottomNav";

type PhoneFrameProps = PropsWithChildren<{
  className?: string;
  bg?: string;       // shell background (desktop only)
  screenBg?: string; // screen background
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
      {/* ---------- Mobile: render app normally, no bezel ---------- */}
      <div className="block md:hidden relative min-h-screen">
        <div
          id="phone-root"
          data-phone-root
          className={`relative min-h-screen w-full ${screenBg} overflow-hidden`}
        >
          {/* Scrollable content */}
          <div
            id="phone-scroll"
            key={pathname}
            className="min-h-screen w-full overflow-y-auto"
            style={{ overscrollBehavior: "contain" }}
          >
            {children}
          </div>

          {/* BottomNav inside root so it positions correctly */}
          <BottomNav
            active={tab}
            onChange={setTab}
            className="z-50"
          />
        </div>
      </div>

      {/* ---------- Desktop: show phone shell ---------- */}
      <div className="hidden md:grid place-items-center min-h-screen">
        <div
          className={`relative ${bg} rounded-[3.2rem] p-2 shadow-[0_30px_70px_rgba(0,0,0,0.35)] ring-1 ring-black/20`}
          style={{ width: 390, height: 780 }} // iPhone-ish logical size
        >
          <div className="relative h-full w-full rounded-[2.6rem] bg-black/80 p-1">
            <div
              id="phone-root"
              data-phone-root
              className={`relative h-full w-full ${screenBg} rounded-[28px] overflow-hidden shadow-2xl`}
            >
              {/* Dynamic Island / notch */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 h-8 w-40 rounded-full bg-black/90" />

              {/* Screen content with safe padding */}
              <div className="absolute inset-0 pt-12 pb-8">
                <div
                  id="phone-scroll"
                  key={pathname}
                  className="h-full w-full overflow-y-auto"
                  style={{ overscrollBehavior: "contain" }}
                >
                  {children}
                </div>

                {/* Home indicator */}
                <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-28 rounded-full bg-black/20" />
              </div>

              {/* Bottom nav (inside screen) */}
              <BottomNav
                active={tab}
                onChange={setTab}
                className="z-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
