/**
 * Check if the site is in under construction mode
 * Set NEXT_PUBLIC_UNDER_CONSTRUCTION=true in your .env.local file
 */
export function isUnderConstruction(): boolean {
  return process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === "true";
}

