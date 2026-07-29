import "dotenv/config"
import { PrismaClient, Role, OrderStatus } from "@prisma/client"
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
  const b2bUser = await prisma.user.upsert({
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
  const customerUser = await prisma.user.upsert({
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
  const sikatopProduct = await prisma.product.upsert({
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

  const sikagroutProduct = await prisma.product.upsert({
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

  // 7. Seed Dummy Orders across all OrderStatus lifecycle states
  const dummyOrders = [
    {
      userId: customerUser.id,
      customerName: "Ali Khan",
      customerEmail: "customer@gmail.com",
      customerPhone: "+92 300 1234567",
      shippingAddress: "House 12, Street 4, Sector F-7/2, Islamabad",
      totalAmount: 9900.0,
      status: OrderStatus.PENDING,
      productId: sikatopProduct.id,
      quantity: 2,
      unitPrice: 4200.0,
    },
    {
      userId: b2bUser.id,
      customerName: "BuildCorp Pakistan",
      customerEmail: "contractor@buildcorp.pk",
      customerPhone: "+92 321 9876543",
      shippingAddress: "Plot 45-B, Industrial Area, Gulberg III, Lahore",
      totalAmount: 172500.0,
      status: OrderStatus.PROCESSING,
      productId: sikatopProduct.id,
      quantity: 50,
      unitPrice: 3450.0,
    },
    {
      userId: null, // Guest Checkout
      customerName: "Tariq Mahmood",
      customerEmail: "tariq.m@gmail.com",
      customerPhone: "+92 333 4567890",
      shippingAddress: "Suite 301, Commercial Zone, Phase 5 DHA, Karachi",
      totalAmount: 10250.0,
      status: OrderStatus.DISPATCHED,
      productId: sikagroutProduct.id,
      quantity: 5,
      unitPrice: 1750.0,
    },
    {
      userId: customerUser.id,
      customerName: "Ali Khan",
      customerEmail: "customer@gmail.com",
      customerPhone: "+92 300 1234567",
      shippingAddress: "House 12, Street 4, Sector F-7/2, Islamabad",
      totalAmount: 22000.0,
      status: OrderStatus.DELIVERED,
      productId: sikagroutProduct.id,
      quantity: 12,
      unitPrice: 1650.0,
    },
    {
      userId: null, // Guest Checkout
      customerName: "Usman Raza",
      customerEmail: "usman.raza@yahoo.com",
      customerPhone: "+92 302 7788990",
      shippingAddress: "Flat 4A, Executive Heights, Multan",
      totalAmount: 5700.0,
      status: OrderStatus.CANCELLED,
      productId: sikatopProduct.id,
      quantity: 1,
      unitPrice: 4200.0,
    },
  ]

  for (const orderData of dummyOrders) {
    await prisma.order.create({
      data: {
        userId: orderData.userId ?? undefined,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        shippingAddress: orderData.shippingAddress,
        totalAmount: orderData.totalAmount,
        status: orderData.status,
        items: {
          create: [
            {
              productId: orderData.productId,
              quantity: orderData.quantity,
              unitPrice: orderData.unitPrice,
            },
          ],
        },
      },
    })
  }

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