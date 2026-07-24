import { auth } from "@/auth"

export default async function AdminDashboard() {
  const session = await auth()

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold text-green-600">
        🛡️ Admin Portal Protected Area
      </h1>
      <p className="text-gray-700">
        Logged in as: <strong>{session?.user?.email}</strong>
      </p>
      <p className="text-gray-700">
        Role: <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold">{(session?.user as any)?.role}</span>
      </p>
    </div>
  )
}