"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { applyStorewideDiscountAction } from "@/app/actions/discount-actions"
import { Tag } from "lucide-react"

export function StorewideDiscountController() {
  const router = useRouter()
  const [discount, setDiscount] = useState("0")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const handleApply = async () => {
    setLoading(true)
    setMessage("")
    setIsError(false)

    const parsedDiscount = parseFloat(discount)

    if (isNaN(parsedDiscount)) {
      setMessage("Please enter a valid number")
      setIsError(true)
      setLoading(false)
      return
    }

    const res = await applyStorewideDiscountAction(parsedDiscount)

    if (!res.success) {
      let errorMsg = "Failed to apply storewide discount"
      if (typeof res.error === "string") {
        errorMsg = res.error
      }
      setMessage(errorMsg)
      setIsError(true)
      setLoading(false)
      return
    }

    if (parsedDiscount === 0) {
      setMessage("Successfully removed all discounts storewide.")
    }

    if (parsedDiscount > 0) {
      setMessage(`Successfully applied ${parsedDiscount}% discount storewide!`)
    }

    setIsError(false)
    setLoading(false)
    router.refresh()
  }

  let messageClass = "p-4 rounded-lg text-sm font-semibold mb-4 bg-green-50 border border-green-200 text-green-700"
  if (isError) {
    messageClass = "p-4 rounded-lg text-sm font-semibold mb-4 bg-red-50 border border-red-200 text-red-600"
  }

  let buttonText = "Launch Storewide Sale"
  if (loading) {
    buttonText = "Processing..."
  }

  let resetButtonText = "Reset All Discounts to 0%"
  if (loading) {
    resetButtonText = "Processing..."
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-xl">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
        <Tag className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-black text-gray-900 uppercase">
          Storewide Sale Controller
        </h2>
      </div>

      {message && (
        <div className={messageClass}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
            Global Discount Percentage
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="e.g. 15"
              className="w-32 p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500 font-bold"
            />
            <button
              onClick={handleApply}
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold px-6 py-2.5 rounded-lg transition disabled:opacity-50 text-sm flex-1"
            >
              {buttonText}
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-50">
          <button
            onClick={() => {
              setDiscount("0")
              handleApply()
            }}
            disabled={loading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-2.5 rounded-lg transition disabled:opacity-50 text-xs uppercase tracking-wider"
          >
            {resetButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}