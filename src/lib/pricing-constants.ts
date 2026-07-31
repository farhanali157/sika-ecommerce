// src/lib/pricing-constants.ts
export const FREE_SHIPPING_THRESHOLD = 50_000
export const FLAT_SHIPPING_FEE = 1_500

export function calculateShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE
}