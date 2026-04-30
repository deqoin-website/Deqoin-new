export const STUDIO_CARD_FALLBACKS: Record<string, string> = {
  design: "/images/workflow/design-studio-home.png",
  material: "/images/workflow/material-studio-home.png",
  execution: "/images/workflow/execution-studio-home.png",
};

export function isLegacyBlobUrl(src?: string) {
  return Boolean(src && src.includes("blob.vercel-storage.com"));
}

export function resolveStudioCardImage(src?: string, studioType?: string) {
  if (src && !isLegacyBlobUrl(src)) return src;
  if (studioType && STUDIO_CARD_FALLBACKS[studioType]) {
    return STUDIO_CARD_FALLBACKS[studioType];
  }
  return src || "";
}
