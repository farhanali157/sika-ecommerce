export default function AccountOrdersLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 animate-pulse">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="space-y-4">
          <div className="h-28 bg-white rounded-xl border border-gray-200 p-4"></div>
          <div className="h-28 bg-white rounded-xl border border-gray-200 p-4"></div>
        </div>
      </div>
    </div>
  )
}