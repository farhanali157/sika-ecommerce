import { RefreshCw, Truck } from "lucide-react";

export const metadata = {
  title: "Return & Refund Policy | Sika Pakistan",
  description: "Information regarding order shipments, deliveries, and return guidelines for Sika Pakistan products.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="bg-neutral-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mb-4"></div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Shipping, Return & Refund Policy
          </h1>
          <p className="text-gray-300 font-medium">
            Guidelines on order fulfillment, delivery timelines, and returns.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg flex gap-4 items-start">
            <Truck className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
            <p className="text-sm font-medium text-amber-900 m-0">
              Standard delivery across major commercial sectors in Pakistan takes 3 to 5 business days. Heavy freight and bulk industrial orders are coordinated individually.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <RefreshCw className="h-6 w-6 text-red-600" /> 1. Return Eligibility
            </h2>
            <p>
              Due to the chemical nature of construction products, adhesives, and waterproofing compounds, returns are strictly evaluated. To be eligible for a return, items must be unopened, in their original sealed packaging, and in the same condition that you received them. Requests for returns must be made within 7 days of delivery.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Damaged or Defective Items</h2>
            <p>
              Please inspect your order upon reception. If an item is defective, damaged, or if you receive the wrong item, contact our support team immediately via email or WhatsApp so that we can evaluate the issue and make it right.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Refunds Process</h2>
            <p>
              Once your returned item is received and inspected by our warehouse team, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment or bank account within a specified number of business days.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}