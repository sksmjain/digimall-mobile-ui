// Call this instead of navigate('/path')
import type { NavigateFunction } from "react-router-dom";

export function openCardWithSlide(navigate: NavigateFunction, to: string) {
  // Signal the transition type (optional, but handy if you want variants later)
  console.log("hi");
  navigate(to, { state: { routeAnim: "card-right" } });
}