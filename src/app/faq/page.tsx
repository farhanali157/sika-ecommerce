import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "FAQ | Sika Pakistan",
  description: "Frequently asked questions about Sika Pakistan products, orders, shipping, and B2B accounts.",
};

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take within Pakistan?",
        a: "Standard delivery typically takes 3-5 business days for major cities (Lahore, Karachi, Islamabad) and 5-7 business days for remote areas. Bulk industrial orders may require specialized freight coordination.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order is dispatched, you will receive an email and SMS with a tracking number. You can also view your order status in real-time by logging into your account and navigating to 'My Orders'.",
      },
    ],
  },
  {
    category: "Products & Application",
    items: [
      {
        q: "Where can I find technical data sheets (PDS)?",
        a: "Product Data Sheets (PDS) and Safety Data Sheets (SDS) are available for download directly on every individual product page under the 'Documents' section.",
      },
      {
        q: "Do you offer technical support for product application?",
        a: "Yes. Our technical support team is available to assist you. You can reach out via our Contact page or use the floating WhatsApp chat for immediate application advice.",
      },
    ],
  },
  {
    category: "B2B & Wholesale",
    items: [
      {
        q: "How do I apply for a Sika B2B account?",
        a: "Contractors, distributors, and bulk purchasers can apply for a B2B account through our B2B Portal. Once approved by our admin team, you will unlock wholesale pricing, bulk ordering tools, and dedicated support.",
      },
      {
        q: "Are there minimum order quantities (MOQ) for B2B pricing?",
        a: "Yes, B2B pricing tiers are activated based on specific volume requirements which vary by product category. Details will be provided upon B2B account approval.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Page Header */}
      <section className="bg-neutral-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mb-4"></div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-300 font-medium">
            Find answers to common questions about our products, shipping, and services.
          </p>
        </div>
      </section>

      {/* FAQ Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-10">
        {faqs.map((section, index) => (
          <div key={index}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-2">
              <HelpCircle className="h-5 w-5 text-amber-500" />
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.items.map((faq, i) => (
                <details 
                  key={i} 
                  className="group bg-white border border-gray-200 rounded-lg shadow-sm [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-5 text-gray-900 font-semibold hover:bg-gray-50 transition">
                    {faq.q}
                    <span className="shrink-0 rounded-full bg-gray-100 p-1.5 text-gray-700 sm:p-3 group-open:bg-amber-100 group-open:text-amber-700 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-45"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </summary>

                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Still Need Help CTA */}
        <div className="mt-12 bg-neutral-900 rounded-xl p-8 text-center shadow-lg">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-gray-400 mb-6 text-sm">Our support team is ready to help you with technical or order inquiries.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 px-6 rounded-lg transition"
          >
            Contact Support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}