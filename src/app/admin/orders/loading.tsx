export default function AdminOrdersLoading() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-24 bg-white rounded-2xl border border-gray-200"></div>
        <div className="h-24 bg-white rounded-2xl border border-gray-200"></div>
        <div className="h-24 bg-white rounded-2xl border border-gray-200"></div>
      </div>
      <div className="h-96 bg-white rounded-2xl border border-gray-200"></div>
    </div>
  )
}