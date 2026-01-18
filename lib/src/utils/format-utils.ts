/**
 * Format number with thousand separators
 * @param value Number to format
 * @returns Formatted string (e.g., 1000000 -> "1,000,000")
 */
export function formatCurrency(value: number | string): string {
  const num =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("ko-KR").format(num);
}

/**
 * Parse string with thousand separators to number
 * @param value String to parse
 * @returns Number (e.g., "1,000,000" -> 1000000)
 */
export function parseCurrency(value: string): number {
  const parsed = parseInt(value.replace(/,/g, ""), 10);
  return isNaN(parsed) ? 0 : parsed;
}
