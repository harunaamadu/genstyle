export function safeRedirect(url: string | undefined, fallback = "/") {
  if (!url || !url.startsWith("/") || url.startsWith("//") || url.includes("\\")) {
    return fallback;
  }
  return url;
}