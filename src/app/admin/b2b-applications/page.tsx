import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { FileText, ExternalLink } from "lucide-react"
import { ReviewB2BButtons } from "./review-b2b-button"

export default async function B2BApplicationsPage() {
  const session = await auth()
  const role = session?.user?.role

  if (role !== Role.ADMIN && role !== Role.SUPER_ADMIN) {
    redirect("/admin/orders")
  }

  const applications = await prisma.b2BApplication.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-amber-500" />
          B2B Contractor Applications
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review business proof documents and verify tax registration before granting wholesale pricing tier access.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 border-b border-gray-100 uppercase tracking-wider text-gray-500 font-bold">
              <tr>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Company Details</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 min-w-56">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No B2B contractor applications submitted yet.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-4 font-medium">
                      <div className="font-bold text-gray-900">{app.user.name}</div>
                      <div className="text-gray-500 font-mono text-[11px]">{app.user.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-800">{app.companyName}</div>
                      <div className="text-gray-500 font-mono text-[11px]">NTN: {app.ntnNumber}</div>
                    </td>
                    <td className="py-4 px-4 space-y-1">
                      {app.taxCertificateUrl && (
                        <a
                          href={app.taxCertificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                        >
                          Tax Certificate <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {app.businessProofUrl && (
                        <a
                          href={app.businessProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                        >
                          Business Proof <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold uppercase text-[10px] bg-gray-100 px-2 py-1 rounded-md">
                        {app.status}
                      </span>
                      {app.notes && (
                        <p className="text-[10px] text-gray-500 mt-1 italic">&quot;{app.notes}&quot;</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <ReviewB2BButtons applicationId={app.id} currentStatus={app.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}