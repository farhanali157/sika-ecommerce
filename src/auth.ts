import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import { Role } from "@prisma/client"
import { authRateLimiter } from "@/lib/ratelimit"
import { headers } from "next/headers"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: Role }).role || "CUSTOMER"
        return token
      }

      if (token.id && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string)
        session.user.role = token.role as Role
      }
      return session
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Apply rate limit on login attempts to prevent brute-force attacks
        try {
          const headersList = await headers()
          const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1"
          const { success } = await authRateLimiter.limit(`login_ip_${ip}`)

          if (!success) {
            console.error(`[Auth] Rate limit exceeded for IP: ${ip}`)
            throw new Error("Too many login attempts. Please try again later.")
          }
        } catch (rateLimitError) {
          if (rateLimitError instanceof Error && rateLimitError.message.includes("Too many")) {
            throw rateLimitError
          }
          // Fallback if Redis fails so valid users aren't locked out completely
        }

        const email = credentials.email as string
        const password = credentials.password as string

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.passwordHash) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth DB Error:", error)
          return null
        }
      },
    }),
  ],
})