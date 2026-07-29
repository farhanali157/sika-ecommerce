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

export type CartItemWithProduct = {
  id: string
  productId: string
  quantity: number
  product: {
    name: string
    slug: string
    tieredPrices: TierPriceInput[]
  }
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

export function calculateCartSubtotal(
  items: CartItemWithProduct[],
  userRole?: string
) {
  const isB2B = userRole === "B2B" || userRole === "ADMIN"
  let subtotal = 0
  let totalItems = 0

  const calculatedItems = items.map((item) => {
    const { unitPrice, totalPrice, appliedTier } = calculateItemPrice(
      item.product.tieredPrices,
      item.quantity,
      isB2B
    )

    subtotal += totalPrice
    totalItems += item.quantity

    return {
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productSlug: item.product.slug,
      quantity: item.quantity,
      unitPrice,
      totalPrice,
      appliedTier,
    }
  })

  return {
    items: calculatedItems,
    subtotal,
    totalItems,
  }
}