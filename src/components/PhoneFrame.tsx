import { useEffect, useState, type PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

type PhoneFrameProps = PropsWithChildren<{
  className?: string;
  bg?: string;       // desktop shell bg
  screenBg?: string; // screen bg
}>;

/** Match Tailwind's md breakpoint (768px) */
function useIsDesktop(mdPx: number = 768) {
  const [desk, setDesk] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= mdPx : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(min-width: ${mdPx}px)`);
    const onChange = () => setDesk(mql.matches);
    onChange(); // sync initial
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [mdPx]);
  return desk;
}

export default function PhoneFrame({
  children,
  className = "",
  bg = "bg-black",
  screenBg = "bg-white",
}: PhoneFrameProps) {
  const { pathname } = useLocation();
  const isDesktop = useIsDesktop(); // ✅ ensures only one branch renders
  const [tab, setTab] = useState<"home" | "orders" | "profile">("home");

  return (
    <div className={`min-h-screen w-full ${className}`}>
      {/** ---------- MOBILE: full-screen app (no bezel) ---------- */}
      {!isDesktop && (
        <div className="relative min-h-screen">
          <div
            id="phone-root"
            data-phone-root
            className={`relative min-h-screen w-full ${screenBg}`}
          >
            {/* Scrollable content with space for fixed nav */}
            <div
              id="phone-scroll"
              key={pathname}
              className="min-h-screen w-full overflow-y-auto"
              style={{
                overscrollBehavior: "contain",
                paddingBottom:
                  "calc(env(safe-area-inset-bottom, 0px) + 88px)", // room for nav/toast
              }}
            >
              {children}
            </div>

            {/* Mobile BottomNav: fixed to viewport bottom */}
            <div
              className="fixed inset-x-0 bottom-0 z-50"
              style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
            >
              <BottomNav active={tab} onChange={setTab} />
            </div>
          </div>
        </div>
      )}

      {/** ---------- DESKTOP: phone shell + in-screen nav ---------- */}
      {isDesktop && (
        <div className="grid place-items-center min-h-screen">
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

                {/* Screen content */}
                <div className="absolute inset-0 pt-12 pb-8">
                  <div
                    id="phone-scroll"
                    key={pathname}
                    className="h-full w-full overflow-y-auto pb-20" // room for in-screen nav
                    style={{ overscrollBehavior: "contain" }}
                  >
                    {children}
                  </div>

                  {/* home indicator */}
                  <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-28 rounded-full bg-black/20" />
                </div>

                {/* Desktop BottomNav: absolute inside the phone */}
                <div className="absolute left-3 right-3 bottom-3 z-50">
                  <BottomNav active={tab} onChange={setTab} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
