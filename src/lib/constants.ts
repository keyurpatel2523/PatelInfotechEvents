/* ─── Currency ────────────────────────────────────────────────
 * Change CURRENCY_SYMBOL and CURRENCY_LOCALE here to switch
 * the entire app to a different currency.
 *
 * Examples:
 *   £  / en-GB  → British Pound
 *   $  / en-US  → US Dollar
 *   €  / de-DE  → Euro
 *   ₹  / en-IN  → Indian Rupee
 * ─────────────────────────────────────────────────────────── */
export const CURRENCY_SYMBOL = "£";
export const CURRENCY_LOCALE = "en-GB";

/** Format a number as a currency string, e.g. £1,200 */
export function formatCurrency(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString(CURRENCY_LOCALE)}`;
}

/** Format a number in compact K notation, e.g. £84.3K */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000)
    return `${CURRENCY_SYMBOL}${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)
    return `${CURRENCY_SYMBOL}${(amount / 1_000).toFixed(1)}K`;
  return formatCurrency(amount);
}
