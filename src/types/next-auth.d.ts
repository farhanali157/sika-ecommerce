import type { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      role?: "CUSTOMER" | "B2B" | "ADMIN"
    }
  }

  interface User extends DefaultUser {
    role?: "CUSTOMER" | "B2B" | "ADMIN"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "USER" | "B2B" | "ADMIN"
  }
}
