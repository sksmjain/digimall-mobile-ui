import { ArrowLeft, Home, Package2, Search } from "lucide-react";

type BottomNavProps = {
  active?: "home" | "orders" | "profile";
  onChange?: (tab: "home" | "orders" | "profile") => void;
  avatarUrl?: string;
  className?: string;
};

export default function BottomNav({
  active = "home",
  onChange,
  avatarUrl = "https://i.pravatar.cc/64?img=5",
  className = "",
}: BottomNavProps) {
  const isActive = (t: BottomNavProps["active"]) => active === t;

  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-3 flex items-end justify-between px-3 ${className}`}>
      {/* Left round button (Back) */}
      <button
        onClick={() => history.back()}
        className="pointer-events-auto h-10 w-10 rounded-full bg-white/80 ring-1 ring-black/10 shadow-md backdrop-blur grid place-items-center hover:bg-white"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5 text-black/70" />
      </button>

      {/* Center pill dock */}
      <div className="pointer-events-auto rounded-full bg-white/80 backdrop-blur-xl ring-1 ring-black/10 shadow-[0_8px_20px_rgba(0,0,0,0.12)] px-2.5 py-1.5 flex items-center gap-2">
        {/* Home */}
        <button
          onClick={() => onChange?.("home")}
          className={`h-10 w-10 rounded-full grid place-items-center transition
            ${isActive("home") ? "bg-white text-black shadow" : "text-black/60 hover:text-black"}`}
          aria-label="Home"
        >
          <Home className={`h-5 w-5 ${isActive("home") ? "text-black" : ""}`} />
        </button>

        {/* Orders */}
        <button
          onClick={() => onChange?.("orders")}
          className={`h-10 w-10 rounded-full grid place-items-center transition
            ${isActive("orders") ? "bg-white text-black shadow" : "text-black/60 hover:text-black"}`}
          aria-label="Orders"
        >
          <Package2 className="h-5 w-5" />
        </button>

        {/* Profile avatar */}
        <button
          onClick={() => onChange?.("profile")}
          className={`h-10 w-10 rounded-full overflow-hidden ring-1 transition
            ${isActive("profile") ? "ring-black/20" : "ring-transparent hover:ring-black/10"}`}
          aria-label="Profile"
        >
          <img src={avatarUrl} alt="Me" className="h-full w-full object-cover" />
        </button>
      </div>

      {/* Right round button (Search) */}
      <button
        onClick={() => onChange?.("home")}
        className="pointer-events-auto h-10 w-10 rounded-full bg-white/80 ring-1 ring-black/10 shadow-md backdrop-blur grid place-items-center hover:bg-white"
        aria-label="Search"
      >
        <Search className="h-5 w-5 text-black/70" />
      </button>
    </div>
  );
}
