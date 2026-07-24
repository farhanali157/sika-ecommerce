"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    const res = await signIn("credentials", {
      email,
      redirect: false,
    })

    setLoading(false)

    if (res?.ok && !res?.error) {
      router.push("/admin")
      router.refresh()
    } else {
      setErrorMsg(res?.error ? `Error: ${res.error}` : "User not found or database error.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Sika Ecommerce Sign In
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter seeded account email to test authentication
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. admin@sika.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-amber-500 focus:outline-none text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-amber-500 py-2.5 text-white font-semibold hover:bg-amber-600 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-xs text-gray-600 space-y-1 bg-gray-100 p-3.5 rounded-lg border border-gray-200">
          <p className="font-semibold text-gray-800">Seeded Test Emails:</p>
          <p>
            • Admin: <code className="text-amber-700 font-mono">admin@sika.pk</code>
          </p>
          <p>
            • B2B: <code className="text-amber-700 font-mono">contractor@buildcorp.pk</code>
          </p>
          <p>
            • Customer: <code className="text-amber-700 font-mono">customer@gmail.com</code>
          </p>
        </div>
      </div>
    </div>
  )
}