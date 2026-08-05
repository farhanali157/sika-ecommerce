import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Legal Disclaimer | Sika Pakistan",
  description: "Legal disclaimer regarding product usage, specifications, and liability for Sika Pakistan products.",
};

export default function DisclaimerPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="bg-neutral-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mb-4"></div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Legal Disclaimer
          </h1>
          <p className="text-gray-300 font-medium">
            Important information regarding product application and usage.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg flex gap-4 items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-1" />
            <p className="text-sm font-medium text-red-900 m-0">
              The information contained on this website is for general guidance on matters of interest only. Always refer to the most recent official Product Data Sheet (PDS) before product application.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Product Application & Suitability</h2>
            <p>
              The information, and, in particular, the recommendations relating to the application and end-use of Sika products, are given in good faith based on Sika&apos;s current knowledge and experience of the products when properly stored, handled and applied under normal conditions in accordance with Sika&apos;s recommendations.
            </p>
            <p className="mt-4">
              In practice, the differences in materials, substrates and actual site conditions are such that no warranty in respect of merchantability or of fitness for a particular purpose, nor any liability arising out of any legal relationship whatsoever, can be inferred either from this information, or from any written recommendations, or from any other advice offered.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Testing Requirement</h2>
            <p>
              The user of the product must test the product&apos;s suitability for the intended application and purpose. Sika reserves the right to change the properties of its products. The proprietary rights of third parties must be observed.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Local Variations</h2>
            <p>
              Please note that as a result of specific local regulations the declared data for our products may vary from country to country. Please consult the local Product Data Sheet for the exact product data specific to Pakistan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}