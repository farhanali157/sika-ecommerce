"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  packSize: z.string().min(1, "Pack size is required"),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string().url("Must be a valid image URL")).min(1, "At least one image URL is required"),
  tdsUrl: z.string().url("Must be a valid TDS URL").optional().or(z.literal("")),
  sdsUrl: z.string().url("Must be a valid SDS URL").optional().or(z.literal("")),
  retailPrice: z.number().positive("Retail price must be greater than 0"),
  b2bPrice: z.number().positive("B2B price must be greater than 0").optional(),
  applicationAreaIds: z.array(z.string()).optional(),
})

export async function createProductAction(formData: unknown) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized access" }
  }

  const result = productSchema.safeParse(formData)
  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors }
  }

  const data = result.data

  try {
    const existingSlug = await prisma.product.findUnique({
      where: { slug: data.slug },
    })

    if (existingSlug) {
      return { success: false, error: { slug: ["A product with this slug already exists"] } }
    }

    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        description: data.description,
        packSize: data.packSize,
        categoryId: data.categoryId,
        images: data.images,
        tdsUrl: data.tdsUrl || null,
        sdsUrl: data.sdsUrl || null,
        applicationAreas: data.applicationAreaIds?.length
          ? { connect: data.applicationAreaIds.map((id) => ({ id })) }
          : undefined,
        tieredPrices: {
          create: [
            { minQty: 1, price: data.retailPrice },
            ...(data.b2bPrice ? [{ minQty: 10, price: data.b2bPrice }] : []),
          ],
        },
      },
    })

    revalidatePath("/products")
    revalidatePath("/admin/products")
    revalidatePath("/")

    return { success: true, productId: newProduct.id }
  } catch (err) {
    console.error("[CREATE_PRODUCT_ERROR]", err)
    return { success: false, error: "Database error creating product" }
  }
}