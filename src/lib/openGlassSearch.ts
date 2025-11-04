// glass search morph that works after route changes
export type GlassOptions = {
    targetHeight?: number;      // final height of the big search
    targetWidth?: number;       // final width
    corner?: number;            // final border radius
    bottomGap?: number;         // gap from bottom
    duration?: number;          // ms
  };
  
  export async function openGlassSearch(
    pillEl: HTMLElement,
    overlayRoot: HTMLElement,
    opts: GlassOptions = {}
  ) {
    const {
      targetHeight = 76,
      targetWidth  = Math.min(600, window.innerWidth - 32),
      corner       = 28,
      bottomGap    = 12,
      duration     = 380,
    } = opts;
  
    // ensure layout is painted (route transitions often delay layout)
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  
    const rect = pillEl.getBoundingClientRect(); // viewport coords (correct even inside transforms)
  
    // ghost (fixed to viewport so scrolling/containers won't shift it)
    const ghost = document.createElement("div");
    Object.assign(ghost.style, {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      borderRadius: "9999px",
      background:
        "linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.86))",
      backdropFilter: "saturate(140%) blur(16px)",
      WebkitBackdropFilter: "saturate(140%) blur(16px)",
      boxShadow: "0 18px 45px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.6)",
      border: "1px solid rgba(0,0,0,.08)",
      zIndex: "99",
      willChange: "transform, border-radius, width, height, left, top, opacity",
      overflow: "hidden",
    });
  
    overlayRoot.appendChild(ghost);
  
    // destination frame (bottom center)
    const dstW = targetWidth;
    const dstH = targetHeight;
    const dstLeft = Math.round((window.innerWidth - dstW) / 2);
    const dstTop = Math.round(window.innerHeight - bottomGap - dstH);
  
    // animation (FLIP-ish, but we animate absolute props for crispness)
    const ease = "cubic-bezier(.2,.8,.2,1)";
    const keyframes: Keyframe[] = [
      {
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: "9999px",
        opacity: 1,
        transform: "translateZ(0) scale(1)",
      },
      {
        left: `${dstLeft}px`,
        top: `${dstTop}px`,
        width: `${dstW}px`,
        height: `${dstH}px`,
        borderRadius: `${corner}px`,
        opacity: 1,
        transform: "translateZ(0) scale(1)",
        offset: 0.86,
      },
      {
        left: `${dstLeft}px`,
        top: `${dstTop}px`,
        width: `${dstW}px`,
        height: `${dstH}px`,
        borderRadius: `${corner}px`,
        opacity: 1,
      },
    ];
  
    // tiny content fade for the destination page
    const page = document.querySelector("[data-phone-root]") as HTMLElement | null;
    const content = page?.querySelector("[data-morph-fade]") as HTMLElement | null;
    content && content.animate([{opacity:.0}, {opacity:1}], {duration: duration*0.75, easing: ease});
  
    const anim = ghost.animate(keyframes, { duration, easing: ease, fill: "forwards" });
  
    try { (navigator as any)?.vibrate?.(4); } catch {}
    await anim.finished;
  
    ghost.remove();
  }
  