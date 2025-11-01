import { useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useState } from "react";

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
          className={`relative ${bg} rounded-[3.2rem] p-2 shadow-[0_30px_70px_rgba(0,0,0,0.35)]
                      ring-1 ring-black/20`}
          style={{
            width: 390,  // iPhone 15 logical points
            height: 780,
          }}
        >
          {/* Bezel */}
          <div className="relative h-full w-full rounded-[2.6rem] bg-black/80 p-1">
            {/* Screen */}
            <div className={`relative h-full w-full ${screenBg} rounded-[2.2rem] overflow-hidden`}>
              {/* Dynamic Island / notch */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 h-8 w-40 rounded-full bg-black/90" />
              {/* Screen content (safe areas) */}
              <div className="absolute inset-0 pt-12 pb-8">
                {/* Scrollable app area */}
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
            </div>
          </div>
        </div>
        {/* floating nav (inside PhoneFrame, absolutely positioned) */}
        <BottomNav active={tab} onChange={setTab} />
      </div>
    );
  }
  