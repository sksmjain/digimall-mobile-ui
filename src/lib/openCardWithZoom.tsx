// src/lib/openProductCardWithZoom.ts
import type { NavigateFunction } from "react-router-dom";

export function openCardWithZoom(
  cardEl: HTMLElement,
  to: string,
  navigate: NavigateFunction
) {
  const phoneRoot = cardEl.closest<HTMLElement>("[data-phone-root]");
  if (!phoneRoot) return navigate(to);

  const rootRect = phoneRoot.getBoundingClientRect();
  const r0 = cardEl.getBoundingClientRect();

  const inset = 12;
  const target = {
    left: inset,
    top: inset + 8,
    width: rootRect.width - inset * 2,
    height: rootRect.height - (inset + 8) - inset,
    radiusFrom: getComputedStyle(cardEl).borderRadius || "22px",
    radiusTo: "16px",
  };

  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    zIndex: "1000",
  } as CSSStyleDeclaration);

  const ghost = cardEl.cloneNode(true) as HTMLElement;
  ghost.querySelectorAll("[aria-label='Save']").forEach((el) => el.remove());

  Object.assign(ghost.style, {
    position: "absolute",
    left: `${target.left}px`,
    top: `${target.top}px`,
    width: `${target.width}px`,
    height: `${target.height}px`,
    margin: "0",
    borderRadius: target.radiusTo,
    overflow: "hidden",
    boxShadow: "0 16px 40px rgba(0,0,0,.18)",
    transformOrigin: "top left",
    willChange: "transform, border-radius, opacity",
    background: "inherit",
  } as CSSStyleDeclaration);

  const dx = r0.left - (rootRect.left + target.left);
  const dy = r0.top - (rootRect.top + target.top);
  const sx = r0.width / target.width;
  const sy = r0.height / target.height;

  ghost.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
  ghost.style.borderRadius = target.radiusFrom;

  const backdrop = document.createElement("div");
  Object.assign(backdrop.style, {
    position: "absolute",
    inset: "0",
    background: "rgba(255,255,255,0)",
  });

  overlay.appendChild(backdrop);
  overlay.appendChild(ghost);
  phoneRoot.appendChild(overlay);

  const prevOpacity = (cardEl.style.opacity ?? "");
  cardEl.style.transition = "opacity .12s ease";
  cardEl.style.opacity = "0.25";

  const dur = 300;
  const ease = "cubic-bezier(.2,.8,.2,1)";

  // 👇 Overshoot keyframes (scale to 1.02 then settle to 1.00)
  const a1 = ghost.animate(
    [
      {
        transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
        borderRadius: target.radiusFrom,
        offset: 0,
      } as any,
      {
        transform: "translate(0px, 0px) scale(1.02, 1.02)",
        borderRadius: target.radiusTo,
        offset: 0.82,
      } as any,
      {
        transform: "translate(0px, 0px) scale(1, 1)",
        borderRadius: target.radiusTo,
        offset: 1,
      } as any,
    ],
    { duration: dur, easing: ease, fill: "forwards" }
  );

  const a2 = backdrop.animate(
    [{ background: "rgba(255,255,255,0)" }, { background: "rgba(255,255,255,1)" }],
    { duration: dur, easing: ease, fill: "forwards" }
  );

  Promise.all([a1.finished, a2.finished]).then(() => {
    // 🚚 Pass rects for reverse animation
    navigate(to, {
      state: {
        entryFrom: {
          // card rect relative to phone root
          left: r0.left - rootRect.left,
          top: r0.top - rootRect.top,
          width: r0.width,
          height: r0.height,
          radius: target.radiusFrom,
          // phone root size (to recompute transforms on back)
          rootW: rootRect.width,
          rootH: rootRect.height,
        },
      },
    });
    setTimeout(() => {
      overlay.remove();
      cardEl.style.opacity = prevOpacity;
    }, 0);
  });
}
