export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 animate-pulse">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-4 w-28 bg-gray-200 rounded"></div>
        <div className="h-8 w-72 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 h-112.5 bg-white rounded-2xl border border-gray-200 p-6"></div>
          <div className="md:col-span-4 h-64 bg-white rounded-2xl border border-gray-200 p-6"></div>
        </div>
      </div>
    </div>
  )
}