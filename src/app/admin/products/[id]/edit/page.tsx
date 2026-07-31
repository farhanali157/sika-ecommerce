import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { serializeDecimals } from "@/lib/serialize"
import { ProductEditFormClient } from "./product-edit-form-client"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params

  const [rawProduct, categories, applicationAreas] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        applicationAreas: { select: { id: true } },
        tieredPrices: { select: { minQty: true, price: true } },
      },
    }),
    prisma.category.findMany({ select: { id: true, name: true } }),
    prisma.applicationArea.findMany({ select: { id: true, name: true } }),
  ])

  if (!rawProduct) {
    notFound()
  }

  const product = serializeDecimals(rawProduct)

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <ProductEditFormClient
        product={product}
        categories={categories}
        applicationAreas={applicationAreas}
      />
    </div>
  )
}