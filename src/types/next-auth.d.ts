import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      role: "CUSTOMER" | "B2B" | "ADMIN"
    } & DefaultSession["user"]
  }

  interface User {
    role: "CUSTOMER" | "B2B" | "ADMIN"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "CUSTOMER" | "B2B" | "ADMIN"
  }
}