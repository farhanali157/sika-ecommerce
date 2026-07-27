import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (!globalForPrisma.prisma) {
  const connectionString = process.env.DATABASE_URL

  const pool = new pg.Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    ssl: {
      // Allows pooled SSL connections to negotiate TLS without failing on self-signed intermediate CA chains
      rejectUnauthorized: false,
    },
  })
  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter })

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
  }
} else {
  prisma = globalForPrisma.prisma
}

export { prisma }