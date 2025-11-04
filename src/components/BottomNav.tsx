import { ArrowLeft, Home, Package2, Search } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CapsuleMorph from "./CapsuleMorph";

type Tab = "home" | "orders" | "profile";
type Variant = "dock" | "product" | "auto";

type BottomNavProps = {
  active?: Tab;                       // optional manual control
  onChange?: (tab: Tab) => void;
  avatarUrl?: string;
  className?: string;
  /** layout selector:
   *  - "auto" (default): uses "product" on /product/* else "dock"
   *  - "product": back + search pill + home (your screenshot)
   *  - "dock": circular dock with home/orders/profile
   */
  variant?: Variant;
  productSearchPlaceholder?: string;  // defaults to "Search"
};

export default function BottomNav(props: BottomNavProps) {
  const {
    active, onChange, avatarUrl = "https://i.pravatar.cc/64?img=5",
    className = "", variant = "auto", productSearchPlaceholder = "Search",
  } = props;

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const inferred: Tab =
    pathname === "/" ? "home"
      : pathname.startsWith("/orders") ? "orders"
      : pathname.startsWith("/profile") ? "profile"
      : "home";

  const current = active ?? inferred;
  const isActive = (t: Tab) => current === t;
  const go = (t: Tab, path: string) => { onChange?.(t); navigate(path); };

  const resolvedVariant: Exclude<Variant, "auto"> =
    variant === "auto" ? (pathname.startsWith("/product") ? "product" : "dock") : variant;

  // 🔹 state for morphing search overlay
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [fromRect, setFromRect] = React.useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const searchBtnRef = React.useRef<HTMLButtonElement>(null);

  const openMorphSearch = () => {
    if (searchBtnRef.current) {
      const r = searchBtnRef.current.getBoundingClientRect();
      setFromRect({ x: r.x, y: r.y, width: r.width, height: r.height });
    }
    setSearchOpen(true);
    // don’t navigate; we present overlay
  };

  // ----- PRODUCT LAYOUT (Back • Search pill • Home) -----
  if (resolvedVariant === "product") {
    return (
      <>
        <div className={`pointer-events-none absolute inset-x-0 bottom-3 px-3 ${className}`}>
          <div className="pointer-events-auto flex justify-between">
            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="h-11 w-11 rounded-full bg-white/85 ring-1 ring-black/10 shadow-md backdrop-blur grid place-items-center hover:bg-white"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5 text-black/70" />
            </button>

            {/* Big search pill (launches morph overlay) */}
            <button
              ref={searchBtnRef}
              onClick={openMorphSearch}
              className="mx-3 flex-1 h-11 rounded-full bg-white/85 ring-1 ring-black/10 shadow-[0_8px_20px_rgba(0,0,0,0.12)] backdrop-blur
                         flex items-center gap-2.5 px-4 hover:bg-white"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-black/65" />
              <span className="text-[15px] leading-none text-black/60">
                {productSearchPlaceholder}
              </span>
            </button>

            {/* Home */}
            <button
              onClick={() => go("home", "/")}
              className="h-11 w-11 rounded-full bg-white/85 ring-1 ring-black/10 shadow-md backdrop-blur grid place-items-center hover:bg-white"
              aria-label="Home"
            >
              <Home className="h-5 w-5 text-black/80" />
            </button>
          </div>
        </div>

        {/* 🔹 Overlay */}
        <CapsuleMorph
          open={searchOpen}
          fromRect={fromRect}
          placeholder={productSearchPlaceholder}
          onClose={() => setSearchOpen(false)}
        />
      </>
    );
  }

  // ----- DOCK LAYOUT (unchanged) -----
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-3 flex items-end justify-between items-center px-3 ${className}`}>
      <div className="pointer-events-auto rounded-full bg-white/80 backdrop-blur-xl ring-1 ring-black/10 shadow-[0_8px_20px_rgba(0,0,0,0.12)] px-2.5 py-1.5 flex items-center gap-2">
        <button
          onClick={() => go("home", "/")}
          className={`h-10 w-10 rounded-full grid place-items-center transition ${isActive("home") ? "bg-white text-black shadow" : "text-black/60 hover:text-black"}`}
          aria-label="Home"
        >
          <Home className={`h-5 w-5 ${isActive("home") ? "text-black" : ""}`} />
        </button>
        <button
          onClick={() => go("orders", "/explore")}
          className={`h-10 w-10 rounded-full grid place-items-center transition ${isActive("orders") ? "bg-white text-black shadow" : "text-black/60 hover:text-black"}`}
          aria-label="Orders"
        >
          <Package2 className="h-5 w-5" />
        </button>
        <button
          onClick={() => go("profile", "/profile")}
          className={`h-10 w-10 rounded-full overflow-hidden ring-1 transition ${isActive("profile") ? "ring-black/20" : "ring-transparent hover:ring-black/10"}`}
          aria-label="Profile"
        >
          <img src={avatarUrl} alt="Me" className="h-full w-full object-cover" />
        </button>
      </div>
      <button
        onClick={() => navigate("/search")}
        className="pointer-events-auto h-10 w-10 rounded-full bg-white/80 ring-1 ring-black/10 shadow-md backdrop-blur grid place-items-center hover:bg-white"
        aria-label="Search"
      >
        <Search className="h-5 w-5 text-black/70" />
      </button>
    </div>
  );
}