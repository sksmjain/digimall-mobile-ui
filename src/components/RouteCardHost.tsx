import { Outlet, useLocation } from "react-router-dom";

/**
 * Wraps routed content and animates the *incoming* page
 * as a card sliding from right → left (inside PhoneFrame).
 */
export default function RouteCardHost() {
  const { pathname } = useLocation();

  // If you ever add more variants, switch on state?.routeAnim
  const animClass = "animate-route-card-in";

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        key={pathname}                       // re-run animation on route change
        className={`absolute inset-0 ${animClass} will-change-transform`}
      >
        <Outlet />
      </div>
    </div>
  );
}
