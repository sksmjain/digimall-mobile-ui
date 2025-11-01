import { useLocation } from "react-router-dom";
import { useState } from "react";
import BottomNav from "./BottomNav";

type PhoneFrameProps = {
  children: React.ReactNode;
  className?: string;
  bg?: string;       // phone shell background
  screenBg?: string; // screen background
};

export default function PhoneFrame({
  children,
  className = "",
  bg = "bg-black",
  screenBg = "bg-white",
}: PhoneFrameProps) {
  const { pathname } = useLocation();
  const [tab, setTab] = useState<"home" | "orders" | "profile">("home");

  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${className}`}>
      {/* Phone shell */}
      <div
        className={`relative ${bg} rounded-[3.2rem] p-2 shadow-[0_30px_70px_rgba(0,0,0,0.35)] ring-1 ring-black/20`}
        style={{ width: 390, height:800 }} // iPhone-ish logical size
      >
        {/* Bezel */}
        <div className="relative h-full w-full rounded-[2.6rem] bg-black/80 p-1">
          {/* Screen (positioning context for everything inside) */}
          <div
            id="phone-root"
            data-phone-root
            className={`relative h-full w-full ${screenBg} rounded-[28px] overflow-hidden shadow-2xl`}
          >
            {/* Dynamic Island / notch */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 h-8 w-40 rounded-full bg-black/90" />

            {/* Screen content area with safe padding */}
            <div className="absolute inset-0 pt-12 pb-8">
              {/* Scrollable app content */}
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

            {/* ✅ BottomNav lives INSIDE the screen and is positioned relative to it */}
            <BottomNav
              active={tab}
              onChange={setTab}
              className="z-50"
              /* BottomNav already positions itself absolute with bottom-3.
                 If you want a bit more lift over safe-area, add this in the component:
                 style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
              */
            />
          </div>
        </div>
      </div>
    </div>
  );
}
