import { PrismaClient, Role } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import bcrypt from "bcryptjs"

// 1. Instantiate PG Pool
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in process.env")
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
})

// 2. Instantiate Driver Adapter and Prisma Client
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // 3. Generate Password Hash
  const hashedPassword = await bcrypt.hash("Admin@123456", 10)

  // 4. Seed Users
  await prisma.user.upsert({
    where: { email: "admin@sika.pk" },
    update: { passwordHash: hashedPassword },
    create: {
      email: "admin@sika.pk",
      name: "Sika Super Admin",
      role: Role.ADMIN,
      passwordHash: hashedPassword,
    },
  })

  await prisma.user.upsert({
    where: { email: "contractor@buildcorp.pk" },
    update: { passwordHash: hashedPassword },
    create: {
      email: "contractor@buildcorp.pk",
      name: "BuildCorp Pakistan",
      role: Role.B2B,
      companyName: "BuildCorp PK Ltd",
      ntnNumber: "NTN-9982341-0",
      passwordHash: hashedPassword,
    },
  })

  await prisma.user.upsert({
    where: { email: "customer@gmail.com" },
    update: { passwordHash: hashedPassword },
    create: {
      email: "customer@gmail.com",
      name: "Ali Khan",
      role: Role.CUSTOMER,
      passwordHash: hashedPassword,
    },
  })

  // 5. Seed Categories
  const waterproofing = await prisma.category.upsert({
    where: { slug: "waterproofing" },
    update: {},
    create: {
      name: "Waterproofing",
      slug: "waterproofing",
      description: "Cementitious and liquid applied waterproofing membranes for basements, roofs, and wet areas.",
    },
  })

  const concreteRepair = await prisma.category.upsert({
    where: { slug: "concrete-repair" },
    update: {},
    create: {
      name: "Concrete Repair & Protection",
      slug: "concrete-repair",
      description: "Structural repair mortars, pore sealers, and protective coatings for reinforced concrete structures.",
    },
  })

  const tiling = await prisma.category.upsert({
    where: { slug: "tiling" },
    update: {},
    create: {
      name: "Tile Adhesives & Grouts",
      slug: "tiling",
      description: "High performance tile adhesives, joint fillers, and epoxy grouts for heavy duty installations.",
    },
  })

  // 6. Seed Products
  await prisma.product.upsert({
    where: { slug: "sikatop-seal-107" },
    update: {},
    create: {
      name: "SikaTop Seal-107",
      slug: "sikatop-seal-107",
      sku: "SKU-STS-107",
      description: "Two-part polymer modified cementitious waterproof slurry mortar.",
      packSize: "25 kg set",
      stockQty: 150,
      categoryId: waterproofing.id,
      tdsUrl: "https://pk.sika.com/content/dam/dms/pk01/m/sikatop_seal-107.pdf",
      sdsUrl: "https://pk.sika.com/content/dam/dms/pk01/s/sikatop_seal-107_sds.pdf",
      tieredPrices: {
        create: [
          { minQty: 1, price: 4200.0 },
          { minQty: 10, price: 3800.0 },
          { minQty: 50, price: 3450.0 },
        ],
      },
    },
  })

  await prisma.product.upsert({
    where: { slug: "sikagrout-214-pk" },
    update: {},
    create: {
      name: "SikaGrout-214 PK",
      slug: "sikagrout-214-pk",
      sku: "SKU-SGR-214",
      description: "1-component shrinkage compensated cementitious precision grout.",
      packSize: "20 kg bag",
      stockQty: 200,
      categoryId: concreteRepair.id,
      tdsUrl: "https://pk.sika.com/content/dam/dms/pk01/g/sikagrout-214_pk.pdf",
      tieredPrices: {
        create: [
          { minQty: 1, price: 1850.0 },
          { minQty: 20, price: 1650.0 },
          { minQty: 100, price: 1480.0 },
        ],
      },
    },
  })

  await prisma.product.upsert({
    where: { slug: "sika-ceram-102-pk" },
    update: {},
    create: {
      name: "Sika Ceram-102 PK",
      slug: "sika-ceram-102-pk",
      sku: "SKU-SCR-102",
      description: "High quality cementitious tile adhesive for ceramic tiles.",
      packSize: "20 kg bag",
      stockQty: 300,
      categoryId: tiling.id,
      tieredPrices: {
        create: [
          { minQty: 1, price: 1250.0 },
          { minQty: 25, price: 1100.0 },
          { minQty: 100, price: 950.0 },
        ],
      },
    },
  })

  console.log("Seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })