"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { applyStorewideDiscountAction, updateAnnouncementAction } from "@/app/actions/discount-actions"
import { Tag, Megaphone, Plus, Trash2 } from "lucide-react"

type AnnouncementItem = {
  text: string
  textColor: string
}

type Props = {
  initialSettings?: {
    announcementMessages: string
    announcementBgColor: string
    isAnnouncementActive: boolean
  } | null
}

export function StorewideDiscountController({ initialSettings }: Props) {
  const router = useRouter()
  const [discount, setDiscount] = useState("0")

  // Parse initial messages or fallback to 1 default
  let parsedMsgs: AnnouncementItem[] = [{ text: "🎉 SPECIAL SALE LIVE NOW!", textColor: "#ffffff" }]
  try {
    if (initialSettings?.announcementMessages) {
      const decoded = JSON.parse(initialSettings.announcementMessages)
      if (Array.isArray(decoded)) {
        parsedMsgs = decoded.map((m) =>
          typeof m === "string" ? { text: m, textColor: "#ffffff" } : m
        )
      }
    }
  } catch {}

  const [messages, setMessages] = useState<AnnouncementItem[]>(parsedMsgs)
  const [bgColor, setBgColor] = useState(initialSettings?.announcementBgColor || "#171717")
  const [isActive, setIsActive] = useState(initialSettings?.isAnnouncementActive ?? true)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const handleAddMessage = () => {
    if (messages.length < 6) {
      setMessages([...messages, { text: "", textColor: "#ffffff" }])
    }
  }

  const handleRemoveMessage = (index: number) => {
    if (messages.length > 1) {
      setMessages(messages.filter((_, i) => i !== index))
    }
  }

  const handleMessageChange = (index: number, field: keyof AnnouncementItem, value: string) => {
    const updated = [...messages]
    updated[index][field] = value
    setMessages(updated)
  }

  const handleApplyDiscount = async () => {
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
      setMessage(typeof res.error === "string" ? res.error : "Failed to apply storewide discount")
      setIsError(true)
      setLoading(false)
      return
    }

    if (parsedDiscount === 0) {
      setMessage("Successfully removed all discounts storewide.")
    } else {
      setMessage(`Successfully applied ${parsedDiscount}% discount storewide!`)
    }

    setLoading(false)
    router.refresh()
  }

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setIsError(false)

    const validMessages = messages.filter((m) => m.text.trim() !== "")
    if (validMessages.length === 0) {
      setMessage("Please add at least one announcement message.")
      setIsError(true)
      setLoading(false)
      return
    }

    const res = await updateAnnouncementAction({
      announcementMessages: JSON.stringify(validMessages),
      announcementBgColor: bgColor,
      isAnnouncementActive: isActive,
    })

    if (!res.success) {
      setMessage("Failed to update announcement bar")
      setIsError(true)
      setLoading(false)
      return
    }

    setMessage("Announcement bar settings updated successfully!")
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl">
      {/* Storewide Sale Controller Box */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
          <Tag className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-black text-gray-900 uppercase">
            Storewide Sale Controller
          </h2>
        </div>

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
                onClick={handleApplyDiscount}
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold px-6 py-2.5 rounded-lg transition disabled:opacity-50 text-sm flex-1"
              >
                {loading ? "Processing..." : "Launch Storewide Sale"}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-50">
            <button
              onClick={() => {
                setDiscount("0")
                handleApplyDiscount()
              }}
              disabled={loading}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-2.5 rounded-lg transition disabled:opacity-50 text-xs uppercase tracking-wider"
            >
              Reset All Discounts to 0%
            </button>
          </div>
        </div>
      </div>

      {/* Announcement Bar Controller Box */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-black text-gray-900 uppercase">
              Scrolling Announcement Bar ({messages.length}/6)
            </h2>
          </div>
          {messages.length < 6 && (
            <button
              type="button"
              onClick={handleAddMessage}
              className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-lg transition"
            >
              <Plus className="h-3.5 w-3.5" /> Add Message
            </button>
          )}
        </div>

        <form onSubmit={handleSaveAnnouncement} className="space-y-4">
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {messages.map((item, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">
                      Message {index + 1}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-gray-500">Text Color:</span>
                      <input
                        type="color"
                        value={item.textColor}
                        onChange={(e) => handleMessageChange(index, "textColor", e.target.value)}
                        className="h-6 w-8 rounded border cursor-pointer p-0.5 bg-white"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleMessageChange(index, "text", e.target.value)}
                    placeholder="e.g. 🔥 SPECIAL SALE LIVE NOW!"
                    className="w-full p-2 text-xs rounded-md border border-gray-300 font-medium focus:outline-none focus:border-amber-500 bg-white"
                    required
                  />
                </div>
                {messages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMessage(index)}
                    className="text-gray-400 hover:text-red-600 transition p-1.5"
                    title="Remove message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Bar Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-9 w-12 rounded border cursor-pointer p-1 bg-white"
              />
              <span className="text-xs font-mono uppercase font-semibold">{bgColor}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAnnouncementActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
            />
            <label htmlFor="isAnnouncementActive" className="text-xs font-bold uppercase text-gray-900 cursor-pointer">
              Show Ticker Bar Live on Site
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold px-6 py-2.5 rounded-lg transition disabled:opacity-50 text-xs uppercase tracking-wider"
          >
            {loading ? "Saving..." : "Save Announcement Settings"}
          </button>
        </form>
      </div>

      {message && (
        <div
          className={`lg:col-span-2 p-4 rounded-lg text-sm font-semibold ${
            isError
              ? "bg-red-50 border border-red-200 text-red-600"
              : "bg-green-50 border border-green-200 text-green-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}