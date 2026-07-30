import { prisma } from "@/lib/prisma"
import { ProductFormClient } from "./product-form-client"

export default async function NewProductPage() {
  const [categories, applicationAreas] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true } }),
    prisma.applicationArea.findMany({ select: { id: true, name: true } }),
  ])

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <ProductFormClient
        categories={categories}
        applicationAreas={applicationAreas}
      />
    </div>
  )
}