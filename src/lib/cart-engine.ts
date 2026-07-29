import { Prisma } from "@prisma/client"

export type TierPriceInput = {
  minQty: number
  price: number | Prisma.Decimal
}

export type CalculatedItemPrice = {
  unitPrice: number
  totalPrice: number
  appliedTier: number | null
}

export function calculateItemPrice(
  tieredPrices: TierPriceInput[],
  quantity: number,
  isB2B: boolean
): CalculatedItemPrice {
  if (!tieredPrices || tieredPrices.length === 0) {
    return { unitPrice: 0, totalPrice: 0, appliedTier: null }
  }

  // Safely normalize Decimal or number inputs to JavaScript numbers
  const normalizedTiers = tieredPrices.map((tier) => ({
    minQty: tier.minQty,
    price: typeof tier.price === "number" ? tier.price : Number(tier.price),
  }))

  // Sort tiers descending to check highest quantity threshold first
  const sortedTiers = [...normalizedTiers].sort((a, b) => b.minQty - a.minQty)

  // Retail customers always receive base price (lowest minQty tier)
  if (!isB2B) {
    const baseRetailTier = sortedTiers[sortedTiers.length - 1]
    const basePrice = baseRetailTier?.price ?? 0
    return { unitPrice: basePrice, totalPrice: basePrice * quantity, appliedTier: null }
  }

  // B2B users receive the highest tier matched by their quantity
  const matchingTier = sortedTiers.find((t) => quantity >= t.minQty)
  const lowestTier = sortedTiers[sortedTiers.length - 1]
  const activePrice = matchingTier?.price ?? lowestTier?.price ?? 0

  return {
    unitPrice: activePrice,
    totalPrice: activePrice * quantity,
    appliedTier: matchingTier ? matchingTier.minQty : null,
  }
}