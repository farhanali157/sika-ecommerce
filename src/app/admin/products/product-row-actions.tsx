"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  updateProductStatusAction, 
  toggleProductFeaturedAction, 
  deleteProductAction 
} from "@/app/actions/product-actions"
import { Trash2, Star, Edit, ExternalLink } from "lucide-react"
import Link from "next/link"

type StatusType = "IN_STOCK" | "OUT_OF_STOCK" | "DISCONTINUED" | "BACKORDER"

type Props = {
  productId: string
  slug: string
  initialStatus: StatusType
  initialFeatured: boolean
}

export function ProductRowActions({ productId, slug, initialStatus, initialFeatured }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<StatusType>(initialStatus)
  const [isFeatured, setIsFeatured] = useState(initialFeatured)
  const [deleting, setDeleting] = useState(false)

  const handleStatusChange = async (newStatus: StatusType) => {
    setStatus(newStatus)
    await updateProductStatusAction(productId, newStatus)
    router.refresh()
  }

  const handleToggleFeatured = async () => {
    const updated = !isFeatured
    setIsFeatured(updated)
    await toggleProductFeaturedAction(productId, updated)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? It will be archived from the store catalog.")) return
    setDeleting(true)
    await deleteProductAction(productId)
    router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Featured Star Toggle */}
      <button
        type="button"
        onClick={handleToggleFeatured}
        title={isFeatured ? "Featured on Homepage" : "Mark as Featured"}
        className={`p-1.5 rounded-md transition ${
          isFeatured ? "text-amber-500 bg-amber-50 hover:bg-amber-100" : "text-gray-300 hover:text-amber-500"
        }`}
      >
        <Star className="h-4 w-4 fill-current" />
      </button>

      {/* Inline Status Dropdown */}
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value as StatusType)}
        className={`text-[11px] font-bold px-2 py-1 rounded-md border outline-none cursor-pointer transition ${
          status === "IN_STOCK"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : status === "OUT_OF_STOCK"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        <option value="IN_STOCK">In Stock</option>
        <option value="OUT_OF_STOCK">Out of Stock</option>
        <option value="BACKORDER">Backorder</option>
        <option value="DISCONTINUED">Discontinued</option>
      </select>

      {/* External Link */}
      <Link
        href={`/product/${slug}`}
        target="_blank"
        className="p-1.5 text-gray-400 hover:text-amber-600 transition"
        title="View Live Page"
      >
        <ExternalLink className="h-4 w-4" />
      </Link>

      {/* Edit Page Link */}
      <Link
        href={`/admin/products/${productId}/edit`}
        className="p-1.5 text-gray-400 hover:text-blue-600 transition"
        title="Edit Product"
      >
        <Edit className="h-4 w-4" />
      </Link>

      {/* Delete Button */}
      <button
        type="button"
        disabled={deleting}
        onClick={handleDelete}
        className="p-1.5 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
        title="Delete Product"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}