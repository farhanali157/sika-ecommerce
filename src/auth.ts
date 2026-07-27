import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import { getDemoUser } from "@/lib/demo-data"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
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

        if (!email || !password) return null

        const normalizedEmail = email.trim().toLowerCase()
        const demoUser = getDemoUser(normalizedEmail)

        if (demoUser && password === demoUser.password) {
          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
          }
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          })

          if (!user || !user.passwordHash) return null

          const isValidPassword = await bcrypt.compare(password, user.passwordHash)

          if (!isValidPassword) return null

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