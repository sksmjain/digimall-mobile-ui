export function portalToPhoneRoot(): HTMLElement {
    return document.querySelector("[data-phone-root]") || document.body;
  }