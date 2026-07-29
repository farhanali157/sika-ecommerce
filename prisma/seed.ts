import "dotenv/config"
import { PrismaClient, Role } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL
if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL must be set in process.env")
}

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  const hashedPassword = await bcrypt.hash("Admin@123456", 10)

  // 1. Seed Admin User
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

  // 2. Seed B2B User
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

  // 3. Seed Retail Customer User
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

  // 4. Seed Categories
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

  // 5. Seed Application Areas
  const roofsTerraces = await prisma.applicationArea.upsert({
    where: { slug: "roofs-terraces" },
    update: {},
    create: {
      name: "Roofs & Terraces",
      slug: "roofs-terraces",
      description: "Exposed and concealed waterproofing membranes for flat roofs, balconies, and parapets.",
    },
  })

  const basementsFoundations = await prisma.applicationArea.upsert({
    where: { slug: "basements-foundations" },
    update: {},
    create: {
      name: "Basements & Foundations",
      slug: "basements-foundations",
      description: "Heavy duty waterproofing systems for below-grade structures and retaining walls.",
    },
  })

  const wetAreas = await prisma.applicationArea.upsert({
    where: { slug: "wet-areas-bathrooms" },
    update: {},
    create: {
      name: "Wet Areas & Bathrooms",
      slug: "wet-areas-bathrooms",
      description: "Flexible under-tile waterproofing membranes and sealants for wet rooms.",
    },
  })

  // Sample High-Res Images for Sika Product Displays
  const sikatopImages = [
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
  ]

  const sikagroutImages = [
    "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
  ]

  const sikaceramImages = [
    "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
  ]

  // 6. Seed Products
  await prisma.product.upsert({
    where: { slug: "sikatop-seal-107" },
    update: {
      images: sikatopImages,
      tdsUrl: "https://pk.sika.com/content/dam/dms/pk01/m/sikatop_seal-107.pdf",
      sdsUrl: "https://pk.sika.com/content/dam/dms/pk01/s/sikatop_seal-107_sds.pdf",
    },
    create: {
      name: "SikaTop Seal-107",
      slug: "sikatop-seal-107",
      sku: "SKU-STS-107",
      description: "Two-part polymer modified cementitious waterproof slurry mortar.",
      packSize: "25 kg set",
      categoryId: waterproofing.id,
      images: sikatopImages,
      tdsUrl: "https://pk.sika.com/content/dam/dms/pk01/m/sikatop_seal-107.pdf",
      sdsUrl: "https://pk.sika.com/content/dam/dms/pk01/s/sikatop_seal-107_sds.pdf",
      applicationAreas: {
        connect: [
          { id: basementsFoundations.id },
          { id: wetAreas.id },
          { id: roofsTerraces.id },
        ],
      },
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
    update: {
      images: sikagroutImages,
      tdsUrl: "https://pk.sika.com/content/dam/dms/pk01/g/sikagrout-214_pk.pdf",
    },
    create: {
      name: "SikaGrout-214 PK",
      slug: "sikagrout-214-pk",
      sku: "SKU-SGR-214",
      description: "1-component shrinkage compensated cementitious precision grout.",
      packSize: "20 kg bag",
      categoryId: concreteRepair.id,
      images: sikagroutImages,
      tdsUrl: "https://pk.sika.com/content/dam/dms/pk01/g/sikagrout-214_pk.pdf",
      applicationAreas: {
        connect: [
          { id: basementsFoundations.id },
        ],
      },
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
    update: {
      images: sikaceramImages,
    },
    create: {
      name: "Sika Ceram-102 PK",
      slug: "sika-ceram-102-pk",
      sku: "SKU-SCR-102",
      description: "High quality cementitious tile adhesive for ceramic tiles.",
      packSize: "20 kg bag",
      categoryId: tiling.id,
      images: sikaceramImages,
      applicationAreas: {
        connect: [
          { id: wetAreas.id },
        ],
      },
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