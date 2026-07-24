import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export const proxy = auth

export const config = {
  matcher: ["/admin/:path*", "/b2b/:path*", "/api/admin/:path*", "/api/b2b/:path*"],
}

export default auth