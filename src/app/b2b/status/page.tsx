import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getMyB2BApplication } from "@/app/actions/b2b-portal"
import { B2BApplicationForm } from "./b2b-application-form"
import { Clock, CheckCircle2, XCircle, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function B2BStatusPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login?callbackUrl=/b2b/status")
  }

  const { application } = await getMyB2BApplication()

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            B2B Partner Portal
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track your commercial contractor accreditation, update tax documentation, and manage wholesale access.
          </p>
        </div>

        {/* 1. Status Banners */}
        {!application && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-600" /> Apply for B2B Wholesale Tier Pricing
            </h2>
            <p className="text-xs text-amber-800 mt-1">
              Submit your NTN registration and company documents to unlock bulk discounts across all Sika product lines.
            </p>
          </div>
        )}

        {application?.status === "PENDING" && (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-700">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-blue-200">
                Application Under Review
              </span>
              <h2 className="text-lg font-bold text-blue-950 mt-2">
                Your B2B Contractor Application is Being Processed
              </h2>
              <p className="text-xs text-blue-800 mt-1">
                Our team is reviewing your NTN certificate for <strong>{application.companyName}</strong>. You will receive access automatically upon approval.
              </p>
            </div>
          </div>
        )}

        {application?.status === "APPROVED" && (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
                Approved B2B Partner
              </span>
              <h2 className="text-lg font-bold text-emerald-950 mt-2">
                Partner Tier Pricing Active
              </h2>
              <p className="text-xs text-emerald-800 mt-1">
                Your NTN credentials ({application.ntnNumber}) are verified. Volume discounts will automatically apply during checkout.
              </p>
              <div className="mt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-black transition"
                >
                  Browse Wholesale Catalog <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {application?.status === "REJECTED" && (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex items-start gap-4">
            <div className="bg-rose-100 p-3 rounded-xl text-rose-700">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="bg-rose-100 text-rose-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-rose-200">
                Action Required
              </span>
              <h2 className="text-lg font-bold text-rose-950 mt-2">
                Application Needs Revision
              </h2>
              <p className="text-xs text-rose-800 mt-1">
                Your previous application was rejected. Please review your company name, NTN tax certificate URL, or business proof documents below and re-submit for review.
              </p>
            </div>
          </div>
        )}

        {/* 2. Application Form (Active when no app exists or when REJECTED) */}
        {(!application || application.status === "REJECTED") && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              {application?.status === "REJECTED" ? "Update & Re-apply" : "Submit B2B Application"}
            </h3>
            <B2BApplicationForm existingApp={application} />
          </div>
        )}
      </div>
    </div>
  )
}