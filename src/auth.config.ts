import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const userRole = auth?.user?.role
      const { pathname } = nextUrl

      // Protect Admin Dashboard
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false
        if (userRole !== "ADMIN") return Response.redirect(new URL("/", nextUrl))
      }

      // Protect B2B Portal
      if (pathname.startsWith("/b2b")) {
        if (!isLoggedIn) return false
        if (userRole !== "B2B" && userRole !== "ADMIN") {
          return Response.redirect(new URL("/", nextUrl))
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "CUSTOMER" | "B2B" | "ADMIN" | undefined
      }
      return session
    },
  },
  providers: [], // Configured in main auth.ts
} satisfies NextAuthConfig