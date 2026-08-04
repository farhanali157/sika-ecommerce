export default function FaqPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-gray-800 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 uppercase">Frequently Asked Questions</h1>
      <div className="space-y-4 text-sm">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
          <h3 className="font-bold text-gray-900">How do I access contractor tiered pricing?</h3>
          <p className="text-gray-600">Register for a B2B Contractor Account through our signup portal, and our administration team will verify your credentials.</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
          <h3 className="font-bold text-gray-900">Where can I track my order status?</h3>
          <p className="text-gray-600">You can view live status updates and past order history anytime from your account dropdown menu under Order Tracking.</p>
        </div>
      </div>
    </main>
  );
}