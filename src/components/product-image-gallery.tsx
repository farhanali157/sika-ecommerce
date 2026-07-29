"use client"

import { useState } from "react"
import Image from "next/image"
import { Package } from "lucide-react"

type Props = {
  images: string[]
  productName: string
  sku: string
}

export function ProductImageGallery({ images, productName, sku }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    images.length > 0 ? images[0] : null
  )

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-neutral-900 flex flex-col items-center justify-center text-gray-400 p-8 border border-neutral-800 shadow-sm">
        <span className="bg-amber-500 text-black text-xs font-black px-3 py-1 rounded tracking-wider uppercase mb-4">
          SIKA OFFICIAL
        </span>
        <Package className="h-20 w-20 text-neutral-700 mb-2" />
        <p className="text-sm font-bold text-gray-300 text-center">{productName}</p>
        <p className="text-xs text-neutral-500 mt-1 font-mono">{sku}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Selected Image Viewer */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <Image
          src={selectedImage || images[0]}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />
      </div>

      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                selectedImage === img
                  ? "border-amber-500 ring-2 ring-amber-500/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}