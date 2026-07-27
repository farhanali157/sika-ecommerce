"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.ok && !res?.error) {
        window.location.assign("/admin")
        return
      }

      setErrorMsg("Invalid email or password.")
    } catch {
      setErrorMsg("Unable to sign in right now. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Sika Ecommerce Sign In
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter your account credentials to access protected portals
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200 text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. admin@sika.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border border-gray-300 p-2.5 text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-300 p-2.5 text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-amber-500 py-2.5 text-white font-semibold hover:bg-amber-600 transition disabled:opacity-50 text-sm shadow-sm"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="text-xs text-gray-600 space-y-1 bg-gray-100 p-3.5 rounded-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-1">Seeded Test Accounts:</p>
          <p>
            • Admin: <code className="text-amber-700 font-mono">admin@sika.pk</code>
          </p>
          <p>
            • B2B: <code className="text-amber-700 font-mono">contractor@buildcorp.pk</code>
          </p>
          <p>
            • Customer: <code className="text-amber-700 font-mono">customer@gmail.com</code>
          </p>
          <div className="pt-2 border-t border-gray-200 mt-2">
            <p className="text-gray-500">
              Default Password: <code className="text-amber-800 font-mono font-bold">Admin@123456</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}