"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the database/server error to monitoring services
    console.error("Database or Server Error Captured:", error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-red-100 p-4 text-red-600 mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
      <p className="mt-2 text-sm text-gray-600">
        We ran into a database error while retrieving this page. Please try refreshing or check back in a few moments.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 transition"
      >
        <RefreshCw className="h-4 w-4" /> Try Again
      </button>
    </div>
  )
}