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
    discountPercent?: number | null
    tieredPrices: TierPriceInput[]
  }
}

export function calculateItemPrice(
  tieredPrices: TierPriceInput[],
  quantity: number,
  isB2B: boolean,
  discountPercent?: number | null
): CalculatedItemPrice {
  if (!tieredPrices || tieredPrices.length === 0) {
    return { unitPrice: 0, totalPrice: 0, appliedTier: null }
  }

  // Safely normalize Decimal or number inputs
  const normalizedTiers = tieredPrices.map((tier) => ({
    minQty: tier.minQty,
    price: typeof tier.price === "number" ? tier.price : Number(tier.price),
  }))

  const sortedTiers = [...normalizedTiers].sort((a, b) => b.minQty - a.minQty)

  let rawUnitPrice = 0
  let appliedTier: number | null = null

  if (!isB2B) {
    const baseRetailTier = sortedTiers[sortedTiers.length - 1]
    rawUnitPrice = baseRetailTier?.price ?? 0
  } else {
    const matchingTier = sortedTiers.find((t) => quantity >= t.minQty)
    const lowestTier = sortedTiers[sortedTiers.length - 1]
    rawUnitPrice = matchingTier?.price ?? lowestTier?.price ?? 0
    appliedTier = matchingTier ? matchingTier.minQty : null
  }

  // Apply discount percent if set by admin
  const discountMultiplier = 1 - (discountPercent ?? 0) / 100
  const finalUnitPrice = Math.round(rawUnitPrice * discountMultiplier)

  return {
    unitPrice: finalUnitPrice,
    totalPrice: finalUnitPrice * quantity,
    appliedTier,
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
      isB2B,
      item.product.discountPercent
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