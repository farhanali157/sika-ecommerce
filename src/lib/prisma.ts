import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  const pool = new pg.Pool({
    connectionString,
    // In serverless, limit each lambda instance to 1-2 connections max
    max: process.env.NODE_ENV === "production" ? 1 : 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

// Always reuse global instance across warm serverless lambdas in production
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
} else {
  // Cache in production to prevent pool leaks across warm serverless functions
  globalForPrisma.prisma = prisma
}