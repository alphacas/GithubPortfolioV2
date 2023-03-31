export const isBrowser = typeof window !== "undefined";
export const isMobile = isBrowser
  ? window.matchMedia("(pointer: coarse)").matches
  : false;
export const canUseDOM: boolean =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined";
