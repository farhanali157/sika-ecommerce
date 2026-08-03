"use client"

import { useState, useTransition } from "react"
import { createSubAdmin } from "@/app/actions/admin-management"
import { UserPlus, X } from "lucide-react"

export function CreateAdminModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await createSubAdmin(formData)
      if (!res.success) {
        setError(res.error || "Failed to create staff account.")
      } else {
        setIsOpen(false)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
      >
        <UserPlus className="h-4 w-4" /> Add Manager / Admin
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900">Create Staff Account</h3>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Hassan Raza"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="manager@sika.pk"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs py-2.5 rounded-xl transition disabled:opacity-50"
                >
                  {isPending ? "Creating..." : "Create Staff Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}