// src/components/BottomNav.tsx
import { useMemo, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Package2, Search } from "lucide-react";
import { searchMorphFrom } from "@/lib/searchMorph";

type Tab = "home" | "orders" | "profile";
type Variant = "dock" | "product" | "auto";

type BottomNavProps = {
  active?: Tab;
  onChange?: (tab: Tab) => void;
  avatarUrl?: string;
  className?: string;
  /** "auto": product layout on /product/*, else dock (default) */
  variant?: Variant;
  productSearchPlaceholder?: string;
  /** Also morph when searching from dock layout (default true) */
  morphInDock?: boolean;
};

export default function BottomNav({
  active,
  onChange,
  avatarUrl = "https://i.pravatar.cc/64?img=5",
  className = "",
  variant = "auto",
  productSearchPlaceholder = "Search",
  morphInDock = true,
}: BottomNavProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ---------- refs (unconditional) ----------
  const productPillRef = useRef<HTMLButtonElement>(null);
  const dockSearchRef = useRef<HTMLButtonElement>(null);

  // ---------- route->tab inference ----------
  const inferred: Tab =
    pathname === "/" ? "home"
    : pathname.startsWith("/orders") ? "orders"
    : pathname.startsWith("/profile") ? "profile"
    : "home";
  const current = active ?? inferred;
  const isActive = (t: Tab) => current === t;

  // ---------- resolve layout (no conditional hooks) ----------
  const resolved: Exclude<Variant, "auto"> = useMemo(() => {
    if (variant !== "auto") return variant;
    return pathname.startsWith("/product") ? "product" : "dock";
  }, [variant, pathname]);

  // ---------- helpers ----------
  const go = useCallback((t: Tab, path: string) => {
    onChange?.(t);
    navigate(path);
  }, [navigate, onChange]);

  const getOverlayRoot = () =>
    (document.getElementById("overlay-root") as HTMLElement) ||
    (document.querySelector("[data-overlay-root]") as HTMLElement) ||
    document.body;

  const runSearchMorph = useCallback(async (anchor: HTMLElement | null, opts?: Parameters<typeof searchMorphFrom>[2]) => {
    if (!anchor) return;
    const overlay = getOverlayRoot();
    try {
      await searchMorphFrom(anchor, overlay, opts);
    } catch {
      /* ignore animation failures; still navigate */
    }
  }, []);

  const handleProductSearch = useCallback(async () => {
    await runSearchMorph(productPillRef.current, {
      targetHeight: 120,
      targetWidth: Math.min(620, window.innerWidth - 24),
      corner: 28,
      bottomGap: 10,
      duration: 420,
    });
  }, [navigate, runSearchMorph]);

  const handleDockSearch = useCallback(async () => {
    if (morphInDock) {
      await runSearchMorph(dockSearchRef.current, {
        targetHeight: 120,
        targetWidth: Math.min(620, window.innerWidth - 24),
        corner: 28,
        bottomGap: 10,
        duration: 420,
      });
    }
    navigate("/search");
  }, [morphInDock, navigate, runSearchMorph]);

  // ---------- PRODUCT LAYOUT ----------
  if (resolved === "product") {
    return (
      <div className={`pointer-events-none absolute inset-x-0 bottom-3 px-3 ${className}`}>
        <div className="pointer-events-auto flex items-center justify-between">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="h-11 w-11 rounded-full bg-white/85 ring-1 ring-black/10 shadow-md backdrop-blur grid place-items-center hover:bg-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-black/70" />
          </button>

          {/* Search pill (morph anchor) */}
          <button
            ref={productPillRef}
            onClick={handleProductSearch}
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
    );
  }

  // ---------- DOCK LAYOUT ----------
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-3 px-3 ${className}`}>
      <div className="pointer-events-auto flex items-end justify-between">
        {/* Dock */}
        <div className="rounded-full bg-white/80 backdrop-blur-xl ring-1 ring-black/10 shadow-[0_8px_20px_rgba(0,0,0,0.12)] px-2.5 py-1.5 flex items-center gap-2">
          {/* Home */}
          <button
            onClick={() => go("home", "/")}
            className={`h-10 w-10 rounded-full grid place-items-center transition
              ${isActive("home") ? "bg-white text-black shadow" : "text-black/60 hover:text-black"}`}
            aria-label="Home"
          >
            <Home className={`h-5 w-5 ${isActive("home") ? "text-black" : ""}`} />
          </button>

          {/* Orders (Explore) */}
          <button
            onClick={() => go("orders", "/explore")}
            className={`h-10 w-10 rounded-full grid place-items-center transition
              ${isActive("orders") ? "bg-white text-black shadow" : "text-black/60 hover:text-black"}`}
            aria-label="Orders"
          >
            <Package2 className="h-5 w-5" />
          </button>

          {/* Profile */}
          <button
            onClick={() => go("profile", "/profile")}
            className={`h-10 w-10 rounded-full overflow-hidden ring-1 transition
              ${isActive("profile") ? "ring-black/20" : "ring-transparent hover:ring-black/10"}`}
            aria-label="Profile"
          >
            <img src={avatarUrl} alt="Me" className="h-full w-full object-cover" />
          </button>
        </div>

        {/* Round Search (optional morph) */}
        <button
          ref={dockSearchRef}
          onClick={handleDockSearch}
          className="h-10 w-10 rounded-full bg-white/80 ring-1 ring-black/10 shadow-md backdrop-blur grid place-items-center hover:bg-white"
          aria-label="Search"
        >
          <Search className="h-5 w-5 text-black/70" />
        </button>
      </div>
    </div>
  );
}
