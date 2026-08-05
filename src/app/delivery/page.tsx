import Link from "next/link";
import { Truck, Store, Clock, PackageCheck } from "lucide-react";

export const metadata = {
  title: "Collection & Delivery | Sika Pakistan",
  description: "Learn about delivery options, shipping timelines, and warehouse collection procedures for Sika Pakistan orders.",
};

export default function CollectionDeliveryPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="bg-neutral-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mb-4"></div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Collection & Delivery Guide
          </h1>
          <p className="text-gray-300 font-medium">
            Everything you need to know about receiving your construction chemical orders.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        
        {/* Delivery Options Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl space-y-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-bold">
              <Truck className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Standard Delivery</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We dispatch orders directly from our regional fulfillment points to your designated project site or address across Pakistan. 
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">✓ Major hubs (Lahore, Karachi, Islamabad): 3–5 days</li>
              <li className="flex items-center gap-2">✓ Outlying regions: 5–7 business days</li>
              <li className="flex items-center gap-2">✓ Heavy freight coordination for bulk pallet orders</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold">
              <Store className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Warehouse Collection</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              For urgent contractor requirements, customers can opt for direct pickup from our regional distribution warehouses upon order confirmation.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">✓ Zero delivery fees for direct collection</li>
              <li className="flex items-center gap-2">✓ Available at designated Lahore & Karachi facilities</li>
              <li className="flex items-center gap-2">✓ Requires digital order confirmation slip upon arrival</li>
            </ul>
          </div>
        </div>

        {/* Detailed Operational Guidelines */}
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 border-t border-gray-200 pt-10">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="h-6 w-6 text-amber-500" /> Operational Timelines & Dispatch Rules
          </h3>
          <p>
            Orders placed on the Sika Pakistan e-commerce platform are processed during regular business hours (Monday through Saturday). Orders confirmed after standard cut-off times will be processed on the following working day.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 pt-4">
            <PackageCheck className="h-6 w-6 text-red-600" /> Site Offloading & Inspection
          </h3>
          <p>
            For heavy construction chemical drums, liquid admixtures, and mortar pallets, the buyer is responsible for ensuring adequate offloading access at the destination site. Please inspect all product seals and quantities upon delivery and report discrepancies within 24 hours.
          </p>
        </div>

        {/* Support CTA */}
        <div className="bg-neutral-950 text-white rounded-xl p-8 text-center space-y-4">
          <h3 className="text-xl font-bold">Have a custom freight requirement?</h3>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            If you are managing a large-scale commercial project requiring specialized bulk transport, reach out to our logistics team directly.
          </p>
          <div>
            <Link
              href="/contact"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-8 rounded-md transition text-sm uppercase tracking-wider"
            >
              Contact Logistics Support
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}