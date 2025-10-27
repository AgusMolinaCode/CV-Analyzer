/**
 * Normalizes URLs by removing localhost prefixes and ensuring proper protocol
 *
 * @param url - The URL to normalize
 * @returns Normalized URL with https:// protocol, or undefined if input is undefined
 *
 * @example
 * normalizeUrl("http://localhost:3000/itsdiegoramos.com")
 * // Returns: "https://itsdiegoramos.com"
 *
 * @example
 * normalizeUrl("github.com/username")
 * // Returns: "https://github.com/username"
 *
 * @example
 * normalizeUrl("https://linkedin.com/in/username")
 * // Returns: "https://linkedin.com/in/username"
 */
export function normalizeUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;

  // Remove localhost prefix if present (handles both http and https)
  let cleanUrl = url.replace(/^https?:\/\/localhost:\d+\//, "");

  // If URL doesn't start with http:// or https://, add https://
  if (!cleanUrl.match(/^https?:\/\//)) {
    cleanUrl = `https://${cleanUrl}`;
  }

  return cleanUrl;
}

/**
 * Normalizes multiple URLs at once
 *
 * @param urls - Object with URL properties to normalize
 * @returns Object with normalized URLs
 */
export function normalizeUrls<T extends Record<string, string | undefined | null>>(
  urls: T
): T {
  const normalized = {} as T;

  for (const [key, value] of Object.entries(urls)) {
    normalized[key as keyof T] = normalizeUrl(value) as T[keyof T];
  }

  return normalized;
}
