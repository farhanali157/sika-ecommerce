// src/auth.config.ts

/**
 * NOTE: This config runs in Edge Middleware (proxy.ts).
 * Do NOT remove callbacks here during cleanups — Edge middleware executes 
 * independently from auth.ts and requires its own JWT/Session hydration 
 * to evaluate user roles correctly on edge routes.
 */

import type { NextAuthConfig } from "next-auth"
import { NextResponse } from "next/server"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "CUSTOMER" | "B2B" | "ADMIN"
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const userRole = auth?.user?.role
      const { pathname } = nextUrl

      // Protect Admin Dashboard
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false
        if (userRole !== "ADMIN") return NextResponse.redirect(new URL("/", nextUrl))
      }

      // Protect B2B Portal
      if (pathname.startsWith("/b2b")) {
        if (!isLoggedIn) return false
        if (userRole !== "B2B" && userRole !== "ADMIN") {
          return NextResponse.redirect(new URL("/", nextUrl))
        }
      }

      // Protect Customer Account Portal
      if (pathname.startsWith("/account")) {
        if (!isLoggedIn) {
          const loginUrl = new URL("/login", nextUrl)
          loginUrl.searchParams.set("callbackUrl", pathname)
          return NextResponse.redirect(loginUrl)
        }
      }

      return true
    },
  },
  providers: [], // Configured in main auth.ts
} satisfies NextAuthConfig