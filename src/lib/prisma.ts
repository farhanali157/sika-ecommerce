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
    max: process.env.NODE_ENV === "production" ? 1 : 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Unconditionally assign to globalThis to prevent pool duplication across warm serverless lambdas
globalForPrisma.prisma = prisma