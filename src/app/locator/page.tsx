import Link from "next/link"
import { Building2, ArrowLeft, Clock, Mail } from "lucide-react"

export const metadata = {
  title: "Distributor Finder | Sika Pakistan",
  description: "Official Sika Pakistan distributor directory and locator network.",
}

export default function LocatorPage() {
  return (
    <div className="min-h-[75vh] bg-gray-50/50 flex items-center justify-center p-6">
      <div className="mx-auto max-w-lg w-full bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-6 shadow-sm">
        
        {/* Icon & Badge */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 mx-auto">
          <Building2 className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
            <Clock className="h-3 w-3" /> Network Directory In Progress
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Distributor Finder Coming Soon
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
            We are currently digitizing our official nationwide supply depot and distributor map. In the meantime, direct orders are shipped directly through Sika Pakistan’s central fulfillment network.
          </p>
        </div>

        {/* Support Callout */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 text-xs space-y-2 text-left">
          <p className="font-bold text-gray-800">Need Immediate Depot or Order Support?</p>
          <p className="text-gray-500 text-[11px]">
            Reach out directly to our regional sales team for contractor pickups or site delivery inquiries.
          </p>
          <a
            href="mailto:support@sika.com.pk"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 pt-1"
          >
            <Mail className="h-3.5 w-3.5" /> support@sika.com.pk
          </a>
        </div>

        {/* Return Button */}
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Explore Product Catalog
          </Link>
        </div>

      </div>
    </div>
  )
}