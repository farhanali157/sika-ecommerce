"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerUser } from "@/app/actions/auth-actions"
import { User, Building2, ArrowRight, Upload } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [accountType, setAccountType] = useState<"CUSTOMER" | "B2B">("CUSTOMER")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    ntnNumber: "",
    taxCertificateUrl: "",
    businessProofUrl: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const res = await registerUser({
        ...formData,
        role: accountType,
      })

      if (res.success) {
        if (accountType === "B2B") {
          router.push("/b2b/status")
        } else {
          router.push("/account")
        }
      } else {
        setError(res.error || "Registration failed.")
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-center">
            Create Account
          </h1>
          <p className="text-xs text-gray-500 text-center mt-1">
            Join the official Sika Pakistan digital platform.
          </p>
        </div>

        {/* Account Type Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setAccountType("CUSTOMER")}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              accountType === "CUSTOMER"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <User className="h-4 w-4" /> Retail Customer
          </button>

          <button
            type="button"
            onClick={() => setAccountType("B2B")}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              accountType === "B2B"
                ? "bg-amber-500 text-black shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Building2 className="h-4 w-4" /> B2B Contractor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          {accountType === "B2B" && (
            <div className="space-y-4 border-t border-gray-100 pt-4 mt-2">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
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

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Upload className="h-3.5 w-3.5" /> Tax Certificate URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.taxCertificateUrl}
                    onChange={(e) => setFormData({ ...formData, taxCertificateUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Upload className="h-3.5 w-3.5" /> Business Proof URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.businessProofUrl}
                    onChange={(e) => setFormData({ ...formData, businessProofUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isPending ? "Creating Account..." : "Create Account"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-amber-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  )
}