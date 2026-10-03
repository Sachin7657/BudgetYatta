/**
 * Standard Indian Rupee (INR) currency formatter with en-IN digit grouping (e.g. ₹1,25,000).
 */
export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatINRNumber(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0';
  }
  return `${Math.round(amount).toLocaleString('en-IN')}`;
}
