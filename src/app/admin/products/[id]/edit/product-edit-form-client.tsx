"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateProductAction } from "@/app/actions/product-actions"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

type Option = { id: string; name: string }

type ProductDetails = {
  id: string
  name: string
  slug: string
  sku: string
  description: string
  packSize: string
  categoryId: string
  images: string[]
  tdsUrl: string | null
  sdsUrl: string | null
  status?: "IN_STOCK" | "OUT_OF_STOCK" | "DISCONTINUED" | "BACKORDER"
  discountPercent?: number | null
  isFeatured?: boolean
  applicationAreas: { id: string }[]
  tieredPrices: { minQty: number; price: number }[]
}

type Props = {
  product: ProductDetails
  categories: Option[]
  applicationAreas: Option[]
}

export function ProductEditFormClient({
  product,
  categories,
  applicationAreas,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const [name, setName] = useState(product.name)
  const [slug, setSlug] = useState(product.slug)
  const [sku, setSku] = useState(product.sku)
  const [description, setDescription] = useState(product.description)
  const [packSize, setPackSize] = useState(product.packSize)
  const [categoryId, setCategoryId] = useState(product.categoryId)

  const initialTiers = product.tieredPrices.length > 0 
    ? product.tieredPrices.map(t => ({ minQty: String(t.minQty), price: String(t.price) }))
    : [{ minQty: "1", price: "" }]

  const [tieredPrices, setTieredPrices] = useState<{ minQty: string; price: string }[]>(initialTiers)

  let initDiscount = "0"
  if (product.discountPercent !== undefined && product.discountPercent !== null) {
    initDiscount = String(product.discountPercent)
  }
  const [discountPercent, setDiscountPercent] = useState(initDiscount)
  
  const [status, setStatus] = useState<"IN_STOCK" | "OUT_OF_STOCK" | "DISCONTINUED" | "BACKORDER">(
    product.status || "IN_STOCK"
  )
  let initFeatured = false
  if (product.isFeatured) {
    initFeatured = true
  }
  const [isFeatured, setIsFeatured] = useState<boolean>(initFeatured)

  const [tdsUrl, setTdsUrl] = useState(product.tdsUrl || "")
  const [sdsUrl, setSdsUrl] = useState(product.sdsUrl || "")

  let initImages = [""]
  if (product.images.length > 0) {
    initImages = product.images
  }
  const [imageUrls, setImageUrls] = useState<string[]>(initImages)
  
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    product.applicationAreas.map((a) => a.id)
  )

  const handleAddTier = () => setTieredPrices([...tieredPrices, { minQty: "", price: "" }])
  const handleRemoveTier = (idx: number) => setTieredPrices(tieredPrices.filter((_, i) => i !== idx))
  const handleTierChange = (idx: number, field: "minQty" | "price", val: string) => {
    const updated = [...tieredPrices]
    updated[idx][field] = val
    setTieredPrices(updated)
  }

  const handleAddImageUrl = () => setImageUrls([...imageUrls, ""])
  const handleRemoveImageUrl = (idx: number) =>
    setImageUrls(imageUrls.filter((_, i) => i !== idx))
  const handleImageUrlChange = (idx: number, val: string) => {
    const updated = [...imageUrls]
    updated[idx] = val
    setImageUrls(updated)
  }

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) => {
      if (prev.includes(id)) {
        return prev.filter((a) => a !== id)
      }
      return [...prev, id]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")

    const validImages = imageUrls.filter((url) => url.trim() !== "")

    if (validImages.length === 0) {
      setErrorMessage("At least one valid Image URL is required.")
      setLoading(false)
      return
    }

    const parsedTiers = tieredPrices
      .map((t) => ({ minQty: parseInt(t.minQty), price: parseFloat(t.price) }))
      .filter((t) => !isNaN(t.minQty) && !isNaN(t.price))

    if (parsedTiers.length === 0) {
      setErrorMessage("At least one valid pricing tier is required.")
      setLoading(false)
      return
    }

    let parsedDiscount = 0
    if (discountPercent) {
      parsedDiscount = parseFloat(discountPercent)
    }

    const payload = {
      name,
      slug,
      sku,
      description,
      packSize,
      categoryId,
      tieredPrices: parsedTiers,
      discountPercent: parsedDiscount,
      status,
      isFeatured,
      images: validImages,
      tdsUrl: tdsUrl || undefined,
      sdsUrl: sdsUrl || undefined,
      applicationAreaIds: selectedAreas,
    }

    const res = await updateProductAction(product.id, payload)

    if (!res.success) {
      let msg = "Please check form values and try again."
      if (typeof res.error === "string") {
        msg = res.error
      }
      setErrorMessage(msg)
      setLoading(false)
      return
    }

    router.push("/admin/products")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-gray-500 hover:text-amber-600 inline-flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Products
          </Link>
          <h1 className="text-2xl font-black text-gray-900 uppercase">
            Edit Product: {product.name}
          </h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold px-6 py-2.5 rounded-lg transition disabled:opacity-50 text-sm"
        >
          {loading ? "Saving Changes..." : "Update Product"}
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-semibold">
          {errorMessage}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2">
          General Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              SKU Code *
            </label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Pack Size *
            </label>
            <input
              type="text"
              required
              value={packSize}
              onChange={(e) => setPackSize(e.target.value)}
              className="w-full p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Description *
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2">
          Pricing & Store Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Category *
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="e.g. 15"
              className="w-full p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
            Volume Pricing Tiers *
          </label>
          <div className="space-y-3">
            {tieredPrices.map((tier, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="flex-1 max-w-50">
                  <input
                    type="number"
                    min="1"
                    required
                    value={tier.minQty}
                    onChange={(e) => handleTierChange(idx, "minQty", e.target.value)}
                    placeholder="Min Qty (e.g. 1)"
                    className="w-full p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex-1 max-w-62.5">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={tier.price}
                    onChange={(e) => handleTierChange(idx, "price", e.target.value)}
                    placeholder="Price in PKR"
                    className="w-full p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                {tieredPrices.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTier(idx)}
                    className="p-2 text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddTier}
            className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 mt-3"
          >
            <Plus className="h-3 w-3" /> Add Pricing Tier
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Stock Availability Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "IN_STOCK" | "OUT_OF_STOCK" | "DISCONTINUED" | "BACKORDER")}
              className="w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-amber-500 font-semibold"
            >
              <option value="IN_STOCK">In Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="BACKORDER">Backorder</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-5">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold uppercase text-gray-900 cursor-pointer">
              Feature on Homepage Showcase
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
            Application Areas
          </label>
          <div className="flex flex-wrap gap-2">
            {applicationAreas.map((area) => {
              const isSelected = selectedAreas.includes(area.id)
              let btnClasses = "bg-gray-50 text-gray-700 border-gray-300 hover:border-amber-500"
              if (isSelected) {
                btnClasses = "bg-amber-500 text-black border-amber-600"
              }
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => toggleArea(area.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${btnClasses}`}
                >
                  {area.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2">
          Media & Technical Datasheets
        </h2>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
            Image URLs *
          </label>
          {imageUrls.map((url, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-300 font-mono text-xs focus:outline-none focus:border-amber-500"
              />
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveImageUrl(idx)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 mt-1"
          >
            <Plus className="h-3 w-3" /> Add Another Image URL
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Technical Data Sheet (TDS PDF URL)
            </label>
            <input
              type="url"
              value={tdsUrl}
              onChange={(e) => setTdsUrl(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Safety Data Sheet (SDS PDF URL)
            </label>
            <input
              type="url"
              value={sdsUrl}
              onChange={(e) => setSdsUrl(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>
    </form>
  )
}