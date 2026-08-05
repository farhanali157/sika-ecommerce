import { FileText, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Sika Pakistan",
  description: "Terms and conditions governing the use of the Sika Pakistan e-commerce platform and product purchases.",
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="bg-neutral-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mb-4"></div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-gray-300 font-medium">
            Please read these terms carefully before using our e-commerce platform.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg flex gap-4 items-start">
            <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
            <p className="text-sm font-medium text-amber-900 m-0">
              By accessing or placing an order through the Sika Pakistan platform, you agree to be bound by these Terms & Conditions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-red-600" /> 1. General Overview
            </h2>
            <p>
              This website is operated by Sika Pakistan. Throughout the site, the terms &quot;we&quot;, &quot;us&quot; and &quot;our&quot; refer to Sika Pakistan. By visiting our site and/or purchasing products from us, you engage in our &quot;Service&quot; and agree to be bound by these terms, including those additional terms and conditions referenced herein.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Online Store Accounts & Security</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your account.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Products, Pricing & Availability</h2>
            <p>
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. Certain products or services may be available exclusively online through the website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Governing Law</h2>
            <p>
              These Terms & Conditions and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Pakistan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}