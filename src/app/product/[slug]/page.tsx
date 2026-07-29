import { notFound } from "next/navigation"
import Link from "next/link"
import { FileText, ShieldAlert, Lock, Layers, ExternalLink, CheckCircle2 } from "lucide-react"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { AddToCartButton } from "@/components/add-to-cart-button"

type Props = {
  params: Promise<{ slug: string }>
}

type TieredPriceSummary = {
  id: string
  minQty: number
  price: number | Prisma.Decimal
}

type ProductDetailPageData = {
  id: string
  name: string
  slug: string
  sku: string
  description: string
  packSize: string
  images: string[]
  tdsUrl: string | null
  sdsUrl: string | null
  category: {
    name: string
    slug: string
  }
  applicationAreas: {
    id: string
    name: string
    slug: string
  }[]
  tieredPrices: TieredPriceSummary[]
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const session = await auth()
  const userRole = session?.user?.role
  const isB2B = userRole === "B2B" || userRole === "ADMIN"

  let product: ProductDetailPageData | null = null

  try {
    product = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        description: true,
        packSize: true,
        images: true,
        tdsUrl: true,
        sdsUrl: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        applicationAreas: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tieredPrices: {
          orderBy: { minQty: "asc" },
          select: {
            id: true,
            minQty: true,
            price: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Database query failed on ProductDetailPage:", error)
    throw error
  }

  if (!product) return notFound()

  const rawRetailPrice = product.tieredPrices[0]?.price ?? 0
  const retailPrice = typeof rawRetailPrice === "number" ? rawRetailPrice : Number(rawRetailPrice)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex text-xs font-medium text-gray-500 mb-6 gap-2 items-center">
        <Link href="/" className="hover:text-amber-600 transition">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.category.slug}`} className="hover:text-amber-600 transition">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Multi-Image Gallery */}
        <ProductImageGallery
          images={product.images}
          productName={product.name}
          sku={product.sku}
        />

        {/* Right Column: Product Overview & Specifications */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                {product.category.name}
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{product.name}</h1>
            <p className="text-2xl font-extrabold text-gray-900 mt-3">
              PKR {retailPrice.toLocaleString()}
              <span className="text-xs text-gray-500 font-normal ml-2">(Retail Base Price)</span>
            </p>
          </div>

          {/* Add to Cart Component */}
          <div className="pt-2">
            <AddToCartButton productId={product.id} />
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>

          {/* Application Areas Tags */}
          {product.applicationAreas.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-amber-600" /> Suitable Application Areas
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.applicationAreas.map((area) => (
                  <Link
                    key={area.id}
                    href={`/area/${area.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-amber-100 hover:text-amber-800 px-3 py-1.5 rounded-lg border border-gray-200 transition"
                  >
                    {area.name} <ExternalLink className="h-3 w-3 opacity-60" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Specifications Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 font-bold text-gray-900">
              Product Specifications
            </div>
            <div className="divide-y divide-gray-100 bg-white">
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-gray-500">Stock Keeping Unit (SKU)</span>
                <span className="font-mono font-semibold text-gray-900">{product.sku}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-gray-500">Standard Pack Size</span>
                <span className="font-semibold text-gray-900">{product.packSize}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-gray-500">Product Category</span>
                <span className="font-semibold text-gray-900">{product.category.name}</span>
              </div>
            </div>
          </div>

          {/* B2B Tiered Pricing Card */}
          <div className="rounded-xl border border-gray-200 bg-neutral-50 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Bulk & Contractor Tiered Rates
              </h3>
              {isB2B && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" /> Unlocked
                </span>
              )}
            </div>

            {isB2B ? (
              <div className="space-y-2">
                {product.tieredPrices.map((tier) => {
                  const priceNum = typeof tier.price === "number" ? tier.price : Number(tier.price)
                  return (
                    <div
                      key={tier.id}
                      className="flex justify-between items-center text-xs py-2 px-3 bg-white rounded-lg border border-gray-200"
                    >
                      <span className="font-semibold text-gray-700">Orders of {tier.minQty}+ units</span>
                      <span className="font-extrabold text-gray-900">
                        PKR {priceNum.toLocaleString()} / unit
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-start gap-3 text-xs text-amber-900 bg-amber-50 p-3.5 rounded-lg border border-amber-200">
                <Lock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">B2B Volume Discount Available</p>
                  <p className="text-amber-800 mt-0.5">
                    Sign in with an approved contractor account to view wholesale bulk pricing tiers.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Technical Documents (TDS / SDS) */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Technical Documentation & Safety Data
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              {product.tdsUrl ? (
                <a
                  href={product.tdsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-amber-900 bg-amber-400 hover:bg-amber-500 px-4 py-3 rounded-xl transition shadow-sm"
                >
                  <FileText className="h-4 w-4" /> Download TDS (PDF)
                </a>
              ) : (
                <div className="flex-1 text-center py-3 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-xl">
                  TDS Pending
                </div>
              )}

              {product.sdsUrl ? (
                <a
                  href={product.sdsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl border border-gray-300 transition"
                >
                  <ShieldAlert className="h-4 w-4 text-gray-600" /> Download SDS (PDF)
                </a>
              ) : (
                <div className="flex-1 text-center py-3 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-xl">
                  SDS Pending
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}