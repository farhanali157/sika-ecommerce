import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Cookie Policy | Sika Pakistan",
  description: "Learn how Sika Pakistan uses cookies to improve your browsing and shopping experience.",
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="bg-neutral-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mb-4"></div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-gray-300 font-medium">
            Last updated: August 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg flex gap-4 items-start">
            <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
            <p className="text-sm font-medium text-amber-900 m-0">
              By continuing to browse and use the Sika Pakistan E-Commerce platform, you agree to our use of cookies as described in this policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer, smartphone, or other device when you visit our website. They are widely used to make websites work more efficiently, enhance the user experience, and provide vital business and marketing information to the site owners.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">We use cookies on the Sika Pakistan platform for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Strictly Necessary Cookies:</strong> Essential for you to browse the website and use its features, such as accessing secure areas, adding items to your cart, and checking out safely.</li>
              <li><strong>Performance & Analytics Cookies:</strong> Allow us to recognize and count the number of visitors and see how users move around our website. This helps us improve the way our platform works.</li>
              <li><strong>Functionality Cookies:</strong> Used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences (like your region or language).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Managing Your Cookies</h2>
            <p>
              You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of the Sika Pakistan online store (such as your shopping cart or account dashboard) may become inaccessible or not function properly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}