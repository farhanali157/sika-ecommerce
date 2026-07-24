import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import { notFound } from "next/navigation"
import { FileText, Check, ShieldAlert } from "lucide-react"

const connectionString = process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      tieredPrices: {
        orderBy: { minQty: "asc" },
      },
    },
  })

  if (!product) return notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Placeholder */}
        <div className="aspect-square w-full rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold border border-gray-200">
          [ {product.name} Image ]
        </div>

        {/* Details & Tiered Pricing */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              {product.category.name}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">SKU: {product.sku} | Pack Size: {product.packSize}</p>
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Tiered Pricing Table */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Bulk & B2B Volume Pricing:</h3>
            <div className="space-y-2">
              {product.tieredPrices.map((tier) => (
                <div key={tier.id} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                  <span className="text-gray-600">Buy {tier.minQty}+ units</span>
                  <span className="font-bold text-gray-900">Rs. {tier.price.toLocaleString()} / unit</span>
                </div>
              ))}
            </div>
          </div>

          {/* Downloads (TDS & SDS) */}
          <div className="flex gap-4 pt-2">
            {product.tdsUrl && (
              <a
                href={product.tdsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg hover:bg-amber-100"
              >
                <FileText className="h-4 w-4" /> Technical Data Sheet (TDS)
              </a>
            )}
            {product.sdsUrl && (
              <a
                href={product.sdsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-200"
              >
                <ShieldAlert className="h-4 w-4" /> Safety Data Sheet (SDS)
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}