/**
 * Formatting helpers that keep the UI from presenting false precision.
 * Internal calculations use full decimal precision; the UI should not.
 */

export function kgToTonnes(kg: number): number {
  return kg / 1000;
}

/** e.g. "12.4" tonnes for headline numbers. */
export function formatTonnes(kg: number, fractionDigits = 1): string {
  return kgToTonnes(kg).toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/** Picks kg for small values and tonnes for larger ones, e.g. "850 kg" or "2.4 t". */
export function formatCo2e(kg: number): string {
  if (Math.abs(kg) < 100) {
    return `${Math.round(kg).toLocaleString()} kg CO₂e`;
  }
  return `${formatTonnes(kg)} t CO₂e`;
}

export function formatPercent(percent: number, fractionDigits = 0): string {
  return `${percent.toFixed(fractionDigits)}%`;
}
