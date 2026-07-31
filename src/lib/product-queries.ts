// src/lib/product-queries.ts
export const STOREFRONT_PRODUCT_FILTER = {
  isArchived: false,
  status: { not: "DISCONTINUED" as const },
}