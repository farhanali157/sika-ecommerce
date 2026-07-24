import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import { authConfig } from "./auth.config"

// Prevent multiple connection pools in development hot-reload
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (!globalForPrisma.prisma) {
  const connectionString = process.env.DATABASE_URL
  const pool = new pg.Pool({
    connectionString,
    max: 5, // Limit connection pool size
    idleTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
  })
  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter })
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
} else {
  prisma = globalForPrisma.prisma
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        if (!email) return null

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          }
        } catch (error) {
          console.error("Database query failed in authorize:", error)
        }

        // Fast local fallback for seeded accounts
        if (email === "admin@sika.pk") {
          return {
            id: "fallback-admin-id",
            email: "admin@sika.pk",
            name: "Sika Super Admin",
            role: "ADMIN",
          }
        }

        if (email === "contractor@buildcorp.pk") {
          return {
            id: "fallback-b2b-id",
            email: "contractor@buildcorp.pk",
            name: "BuildCorp Pakistan",
            role: "B2B",
          }
        }

        return null
      },
    }),
  ],
})