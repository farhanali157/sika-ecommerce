import { Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Sika Pakistan",
  description: "Learn how Sika Pakistan collects, uses, and safeguards your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="bg-neutral-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mb-4"></div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-300 font-medium">
            Your privacy is important to us. Read how we protect your information.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          
          <div className="bg-neutral-50 border-l-4 border-neutral-900 p-6 rounded-r-lg flex gap-4 items-start">
            <Lock className="h-6 w-6 text-neutral-900 shrink-0 mt-1" />
            <p className="text-sm font-medium text-neutral-800 m-0">
              Sika Pakistan respects your privacy and is committed to protecting your personal data in compliance with standard safety practices.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="mb-4">When you visit or make a purchase from our platform, we collect certain information from you, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Identification Details:</strong> Name, email address, phone number, and shipping address provided during checkout or account registration.</li>
              <li><strong>Transaction Data:</strong> Details about orders you make and products you browse on our store.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and device information gathered automatically through cookies.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to fulfill orders placed through the site (including processing your payment information and arranging for shipping), communicate with you regarding order statuses or support queries, and screen our orders for potential risk or fraud.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal data against accidental or unlawful destruction, loss, alteration, or unauthorized disclosure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}