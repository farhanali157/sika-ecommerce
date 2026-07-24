import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string

        // Require both email and password inputs
        if (!email || !password) return null

        try {
          // Look up user in Supabase via singleton Prisma client
          const user = await prisma.user.findUnique({
            where: { email },
          })

          // Reject authorization if user doesn't exist or lacks a password hash
          if (!user || !user.passwordHash) return null

          // Verify incoming plain-text password against bcrypt hash
          const isValidPassword = await bcrypt.compare(password, user.passwordHash)

          if (!isValidPassword) return null

          // Return sanitized user object for JWT token generation
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth DB query failed:", error)
          return null
        }
      },
    }),
  ],
})