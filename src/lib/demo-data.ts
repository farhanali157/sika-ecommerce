type DemoRole = "CUSTOMER" | "B2B" | "ADMIN"

type DemoUser = {
  id: string
  email: string
  name: string
  role: DemoRole
  password: string
}

type DemoCategory = {
  id: string
  name: string
  slug: string
  description: string
}

type DemoProduct = {
  id: string
  name: string
  slug: string
  sku: string
  description: string
  packSize: string
  stockQty: number
  categorySlug: string
  tieredPrices: Array<{ id: string; minQty: number; price: number }>
  tdsUrl?: string
  sdsUrl?: string
}

export const demoUsers: Record<string, DemoUser> = {
  "admin@sika.pk": {
    id: "demo-admin",
    email: "admin@sika.pk",
    name: "Sika Super Admin",
    role: "ADMIN",
    password: "Admin@123456",
  },
  "contractor@buildcorp.pk": {
    id: "demo-b2b",
    email: "contractor@buildcorp.pk",
    name: "BuildCorp Pakistan",
    role: "B2B",
    password: "Admin@123456",
  },
  "customer@gmail.com": {
    id: "demo-customer",
    email: "customer@gmail.com",
    name: "Ali Khan",
    role: "CUSTOMER",
    password: "Admin@123456",
  },
}

export const demoCategories: DemoCategory[] = [
  {
    id: "demo-waterproofing",
    name: "Waterproofing",
    slug: "waterproofing",
    description: "Cementitious and liquid applied waterproofing systems for roofs, basements and wet areas.",
  },
  {
    id: "demo-concrete",
    name: "Concrete Repair & Protection",
    slug: "concrete-repair",
    description: "Structural repair mortars, pore sealers and protective coatings for concrete structures.",
  },
  {
    id: "demo-tiling",
    name: "Tile Adhesives & Grouts",
    slug: "tiling",
    description: "High-performance tile adhesives, grouts and joint fillers for demanding installations.",
  },
]

export const demoProducts: DemoProduct[] = [
  {
    id: "demo-product-1",
    name: "SikaTop Seal-107",
    slug: "sikatop-seal-107",
    sku: "SKU-STS-107",
    description: "Two-part polymer modified cementitious waterproof slurry mortar.",
    packSize: "25 kg set",
    stockQty: 150,
    categorySlug: "waterproofing",
    tdsUrl: "https://pk.sika.com/content/dam/dms/pk01/m/sikatop_seal-107.pdf",
    sdsUrl: "https://pk.sika.com/content/dam/dms/pk01/s/sikatop_seal-107_sds.pdf",
    tieredPrices: [
      { id: "demo-tier-1", minQty: 1, price: 4200 },
      { id: "demo-tier-2", minQty: 10, price: 3800 },
      { id: "demo-tier-3", minQty: 50, price: 3450 },
    ],
  },
  {
    id: "demo-product-2",
    name: "SikaGrout-214 PK",
    slug: "sikagrout-214-pk",
    sku: "SKU-SGR-214",
    description: "Shrinkage compensated cementitious precision grout for structural repairs.",
    packSize: "20 kg bag",
    stockQty: 200,
    categorySlug: "concrete-repair",
    tdsUrl: "https://pk.sika.com/content/dam/dms/pk01/g/sikagrout-214_pk.pdf",
    tieredPrices: [
      { id: "demo-tier-4", minQty: 1, price: 1850 },
      { id: "demo-tier-5", minQty: 20, price: 1650 },
      { id: "demo-tier-6", minQty: 100, price: 1480 },
    ],
  },
  {
    id: "demo-product-3",
    name: "Sika Ceram-102 PK",
    slug: "sika-ceram-102-pk",
    sku: "SKU-SCR-102",
    description: "High quality cementitious tile adhesive for ceramic tiling systems.",
    packSize: "20 kg bag",
    stockQty: 300,
    categorySlug: "tiling",
    tieredPrices: [
      { id: "demo-tier-7", minQty: 1, price: 1250 },
      { id: "demo-tier-8", minQty: 25, price: 1100 },
      { id: "demo-tier-9", minQty: 100, price: 950 },
    ],
  },
]

export function getDemoUser(email: string) {
  return demoUsers[email.trim().toLowerCase()]
}

export function getDemoCategoryBySlug(slug: string) {
  const category = demoCategories.find((item) => item.slug === slug)
  if (!category) return null

  return {
    ...category,
    products: demoProducts
      .filter((product) => product.categorySlug === slug)
      .map((product) => ({ ...product, category })),
  }
}

export function getDemoProductBySlug(slug: string) {
  const product = demoProducts.find((item) => item.slug === slug)
  if (!product) return null

  const category = demoCategories.find((item) => item.slug === product.categorySlug)
  return {
    ...product,
    category: category ?? demoCategories[0],
  }
}
