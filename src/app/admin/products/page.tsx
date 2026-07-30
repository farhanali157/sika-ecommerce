import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Plus, Package, ExternalLink } from "lucide-react"

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      packSize: true,
      images: true,
      category: { select: { name: true } },
      tieredPrices: { select: { minQty: true, price: true }, orderBy: { minQty: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
              Product Inventory Manager
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage product listings, pricing tiers, and datasheets across the store catalog.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold px-4 py-2.5 rounded-lg transition shadow-sm text-sm"
          >
            <Plus className="h-4 w-4" /> Add New Product
          </Link>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-neutral-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Pack Size</th>
                  <th className="py-3.5 px-4">Retail Price</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const rawPrice = product.tieredPrices.find((p) => p.minQty === 1)?.price ?? 0
                  const retailPrice = typeof rawPrice === "number" ? rawPrice : Number(rawPrice)
                  const mainImage = product.images?.[0] || null

                  return (
                    <tr key={product.id} className="hover:bg-amber-50/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {mainImage ? (
                              <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{product.name}</p>
                            <span className="text-[10px] text-gray-400 font-mono">/{product.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-gray-600">
                        {product.sku}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-gray-600">
                        {product.packSize}
                      </td>
                      <td className="py-3 px-4 font-black text-gray-900">
                        Rs. {retailPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-500 hover:text-amber-600 transition inline-block"
                          title="View Live Product Page"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}