/**
 * Classname merge utility (simplified version)
 * Filters out falsy values and joins classnames with space
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}
