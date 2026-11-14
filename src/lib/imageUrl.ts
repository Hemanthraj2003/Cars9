/**
 * Resolves any image source to a renderable URL:
 * - If it's a Telegram file_id (e.g. AgACAgUAAyEGAAM...), routes to /api/images/[file_id]
 * - If it's already an absolute URL (http/https/data:), returns it
 * - If it starts with /api/images/, /images/, /logos/, /uploads/, returns it
 * - Otherwise falls back to /images/cars9-logo.png
 */
export function getDisplayImageUrl(src?: string | null, fallback = "/images/cars9-logo.png"): string {
  if (!src) return fallback;
  const trimmed = src.trim();
  if (!trimmed) return fallback;

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  // Telegram raw file_id (e.g., starts with AgACAg... or has no slashes)
  return `/api/images/${trimmed}`;
}
