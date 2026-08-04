import { ShieldCheck, Award, Globe, Building2 } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="bg-amber-500 text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
            About Sika Pakistan
          </span>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">
            BUILDING TRUST SINCE INCEPTION
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sika is a specialty chemicals company with a leading position in the development and production of systems and products for bonding, sealing, damping, reinforcing, and protection in the building sector and motor vehicle industry.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900">Global Quality</h3>
            <p className="text-xs text-gray-500">
              Swiss-engineered chemical solutions adapted for local construction standards and extreme climates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900">Local Presence</h3>
            <p className="text-xs text-gray-500">
              Headquartered in Phase IV DHA, Lahore, with nationwide distribution channels and expert technical support.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900">ISO 9001 Certified</h3>
            <p className="text-xs text-gray-500">
              Rigorous quality assurance standards ensuring structural integrity across all commercial and industrial projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}