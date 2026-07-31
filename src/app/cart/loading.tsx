export default function CartLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-96 bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="h-6 w-full bg-gray-100 rounded"></div>
            <div className="h-20 w-full bg-gray-100 rounded"></div>
            <div className="h-20 w-full bg-gray-100 rounded"></div>
          </div>
          <div className="lg:col-span-4 h-80 bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="h-6 w-1/2 bg-gray-100 rounded"></div>
            <div className="h-10 w-full bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}