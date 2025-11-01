import { ArrowLeft, Home, Package2, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type Tab = "home" | "orders" | "profile";

type BottomNavProps = {
  active?: Tab;                          // optional manual control
  onChange?: (tab: Tab) => void;        // still supported
  avatarUrl?: string;
  className?: string;
};

export default function BottomNav({
  active,
  onChange,
  avatarUrl = "https://i.pravatar.cc/64?img=5",
  className = "",
}: BottomNavProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Infer active tab from route when prop isn't provided
  const inferred: Tab =
    pathname === "/" ? "home"
    : pathname.startsWith("/orders") ? "orders"
    : pathname.startsWith("/profile") ? "profile"
    : "home";

  const current = active ?? inferred;
  const isActive = (t: Tab) => current === t;

  const go = (t: Tab, path: string) => {
    onChange?.(t);
    navigate(path);
  };

  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-3 flex items-end justify-between px-3 ${className}`}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="pointer-events-auto h-10 w-10 rounded-full bg-white/80 ring-1 ring-black/10 shadow-md backdrop-blur grid place-items-center hover:bg-white"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5 text-black/70" />
      </button>

      {/* Dock */}
      <div className="pointer-events-auto rounded-full bg-white/80 backdrop-blur-xl ring-1 ring-black/10 shadow-[0_8px_20px_rgba(0,0,0,0.12)] px-2.5 py-1.5 flex items-center gap-2">
        {/* Home -> StorePage */}
        <button
          onClick={() => go("home", "/")}
          className={`h-10 w-10 rounded-full grid place-items-center transition ${isActive("home") ? "bg-white text-black shadow" : "text-black/60 hover:text-black"}`}
          aria-label="Home"
        >
          <Home className={`h-5 w-5 ${isActive("home") ? "text-black" : ""}`} />
        </button>

        {/* Orders (stub route) */}
        <button
          onClick={() => go("orders", "/orders")}
          className={`h-10 w-10 rounded-full grid place-items-center transition ${isActive("orders") ? "bg-white text-black shadow" : "text-black/60 hover:text-black"}`}
          aria-label="Orders"
        >
          <Package2 className="h-5 w-5" />
        </button>

        {/* Profile */}
        <button
          onClick={() => go("profile", "/profile")}
          className={`h-10 w-10 rounded-full overflow-hidden ring-1 transition ${isActive("profile") ? "ring-black/20" : "ring-transparent hover:ring-black/10"}`}
          aria-label="Profile"
        >
          <img src={avatarUrl} alt="Me" className="h-full w-full object-cover" />
        </button>
      </div>

      {/* Search (optional route) */}
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
