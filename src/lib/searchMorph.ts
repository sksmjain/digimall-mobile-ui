// No React hooks here — plain DOM animation helper
export type MorphOpts = {
    targetHeight?: number;
    targetWidth?: number;
    corner?: number;
    bottomGap?: number;
    duration?: number;
  };
  
  export async function searchMorphFrom(anchor: HTMLElement, overlayRoot: HTMLElement, opts: MorphOpts = {}) {
    const {
      targetHeight = 76,
      targetWidth = Math.min(560, window.innerWidth - 24),
      corner = 26,
      bottomGap = 12,
      duration = 380,
    } = opts;
  
    // read start rect
    const r = anchor.getBoundingClientRect();
  
    // build ghost
    const ghost = document.createElement("div");
    ghost.style.position = "fixed";
    ghost.style.left = `${r.left}px`;
    ghost.style.top = `${r.top}px`;
    ghost.style.width = `${r.width}px`;
    ghost.style.height = `${r.height}px`;
    ghost.style.borderRadius = getComputedStyle(anchor).borderRadius || "9999px";
    ghost.style.background = "rgba(255,255,255,0.85)";
    ghost.style.backdropFilter = "saturate(160%) blur(16px)";
    ghost.style.boxShadow = "0 12px 40px rgba(0,0,0,.18)";
    ghost.style.zIndex = "99999";
    ghost.style.willChange = "transform, width, height, border-radius, opacity";
    overlayRoot.appendChild(ghost);
  
    // final frame (bottom center)
    const W = targetWidth;
    const H = targetHeight;
    const x = (window.innerWidth - W) / 2;
    const y = window.innerHeight - H - bottomGap;
  
    const keyframes: Keyframe[] = [
      { transform: `translate(0,0) scale(1)`, width: `${r.width}px`,  height: `${r.height}px`,  borderRadius: ghost.style.borderRadius, opacity: .98 },
      { transform: `translate(${x - r.left}px, ${y - r.top}px) scale(1)`, width: `${W}px`, height: `${H}px`, borderRadius: `${corner}px`, opacity: 1 },
    ];
  
    const ease = "cubic-bezier(.2,.7,.2,1)";
    const anim = ghost.animate(keyframes, { duration, easing: ease, fill: "forwards" });
  
    // haptic (best-effort)
    try { (navigator as any)?.vibrate?.(6); } catch {}
  
    await anim.finished.catch(() => { /* ignore */ });
    ghost.remove();
  }
  