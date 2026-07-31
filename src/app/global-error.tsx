"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 uppercase">System Exception</h2>
          <p className="text-xs text-gray-600">
            {error?.message || "An unexpected system error occurred. Please refresh or try again."}
          </p>
          <button
            onClick={() => reset()}
            className="inline-block text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  )
}