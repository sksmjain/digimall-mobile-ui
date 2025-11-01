// src/lib/openProduct.ts
import type { NavigateFunction } from "react-router-dom";

export function openProductWithZoom(cardEl: HTMLElement, imgEl: HTMLImageElement, to: string, navigate: NavigateFunction) {
  const cardRect = imgEl.getBoundingClientRect();
  const clone = imgEl.cloneNode(true) as HTMLImageElement;

  // Overlay container pinned to viewport
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.pointerEvents = "none";
  overlay.style.zIndex = "9999";
  overlay.style.background = "transparent";

  // Clone styling (start at card position)
  Object.assign(clone.style, {
    position: "absolute",
    left: `${cardRect.left}px`,
    top: `${cardRect.top}px`,
    width: `${cardRect.width}px`,
    height: `${cardRect.height}px`,
    objectFit: "cover",
    borderRadius: getComputedStyle(imgEl).borderRadius || "16px",
    boxShadow: "0 16px 40px rgba(0,0,0,.2)",
    willChange: "transform, width, height, left, top, border-radius",
  } as CSSStyleDeclaration);

  overlay.appendChild(clone);
  document.body.appendChild(overlay);

  // Force layout, then animate to fullscreen
  const target = {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    radius: "0px",
  };

  // Fade rest of card slightly
  cardEl.style.transition = "opacity .18s ease";
  cardEl.style.opacity = "0.5";

  const dur = 280; // ms
  const ease = "cubic-bezier(.2,.8,.2,1)";

  // Animate
  const anim = clone.animate(
    [
      {
        left: `${cardRect.left}px`,
        top: `${cardRect.top}px`,
        width: `${cardRect.width}px`,
        height: `${cardRect.height}px`,
        borderRadius: getComputedStyle(imgEl).borderRadius || "16px",
      },
      {
        left: `${target.left}px`,
        top: `${target.top}px`,
        width: `${target.width}px`,
        height: `${target.height}px`,
        borderRadius: target.radius,
      },
    ] as any,
    { duration: dur, easing: ease, fill: "forwards" }
  );

  anim.onfinish = () => {
    navigate(to);            // push route AFTER animation
    // tidy up shortly after route swap
    setTimeout(() => {
      overlay.remove();
      cardEl.style.opacity = "";
    }, 0);
  };
}
