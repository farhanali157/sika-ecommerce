"use client"

import { useState, useTransition } from "react"
import { submitOrUpdateB2BApplication } from "@/app/actions/b2b-portal"
import { Send, Upload } from "lucide-react"

type ExistingApplication = {
  id: string
  companyName: string
  ntnNumber: string
  taxCertificateUrl: string | null   // Add | null here
  businessProofUrl: string | null    // Add | null here
  notes?: string | null
  status: string
}

export function B2BApplicationForm({ existingApp }: { existingApp?: ExistingApplication | null }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    companyName: existingApp?.companyName || "",
    ntnNumber: existingApp?.ntnNumber || "",
    taxCertificateUrl: existingApp?.taxCertificateUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    businessProofUrl: existingApp?.businessProofUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    notes: existingApp?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const res = await submitOrUpdateB2BApplication(formData)
      if (res.success) {
        setSuccess(true)
      } else {
        setError(res.error || "Failed to submit application.")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-lg">
          Application submitted successfully! It is now under review.
        </div>
      )}

      <div>
        <label className="block font-bold text-gray-700 mb-1">Registered Company Name</label>
        <input
          type="text"
          required
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="e.g. BuildCorp Pakistan Ltd"
          className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block font-bold text-gray-700 mb-1">FBR NTN Number</label>
        <input
          type="text"
          required
          value={formData.ntnNumber}
          onChange={(e) => setFormData({ ...formData, ntnNumber: e.target.value })}
          placeholder="e.g. 4819203-7"
          className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-bold text-gray-700 mb-1 flex items-center gap-1">
            <Upload className="h-3.5 w-3.5" /> Tax Certificate Document URL
          </label>
          <input
            type="url"
            required
            value={formData.taxCertificateUrl}
            onChange={(e) => setFormData({ ...formData, taxCertificateUrl: e.target.value })}
            className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="font-bold text-gray-700 mb-1 flex items-center gap-1">
            <Upload className="h-3.5 w-3.5" /> Business Proof / License Document URL
          </label>
          <input
            type="url"
            required
            value={formData.businessProofUrl}
            onChange={(e) => setFormData({ ...formData, businessProofUrl: e.target.value })}
            className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-gray-700 mb-1">Additional Project Details / Notes</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Provide details about your ongoing projects or expected ordering volume..."
          className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {isPending ? "Submitting Application..." : "Submit B2B Application"}
      </button>
    </form>
  )
}