import { PrismaClient, Role } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

// Setup PostgreSQL pool with SSL verification override for Supabase
const connectionString = process.env.DATABASE_URL
const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Cleaning up existing database records...')

  // Clear existing data in cascade order
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.tieredPrice.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding initial categories...')

  // 1. Create Categories
  const waterproofing = await prisma.category.create({
    data: {
      name: 'Waterproofing',
      slug: 'waterproofing',
      description: 'High-performance waterproofing slurries, membranes, and joint sealants.',
    },
  })

  const concreteRepair = await prisma.category.create({
    data: {
      name: 'Concrete Repair & Protection',
      slug: 'concrete-repair',
      description: 'Structural repair mortars, bonding bridges, and corrosion protection.',
    },
  })

  const tiling = await prisma.category.create({
    data: {
      name: 'Tile Adhesives & Grouts',
      slug: 'tiling',
      description: 'Tile fixing mortars, epoxy grouts, and flexible sealants.',
    },
  })

  console.log('Seeding initial products with tiered pricing...')

  // 2. Create Products with Tiered Pricing & Tech Sheet links
  await prisma.product.create({
    data: {
      name: 'SikaTop Seal-107',
      slug: 'sikatop-seal-107',
      sku: 'SKU-107-25KG',
      description: 'Two-part polymer-modified cementitious waterproof mortar slurry for basements, water tanks, and wet areas.',
      packSize: '25 kg set',
      inStock: true,
      stockQty: 150,
      featured: true,
      categoryId: waterproofing.id,
      images: [
        'https://images.sika.com/placeholder.jpg',
      ],
      tdsUrl: 'https://pak.sika.com/tds/sikatop-seal-107.pdf',
      sdsUrl: 'https://pak.sika.com/sds/sikatop-seal-107.pdf',
      tieredPrices: {
        create: [
          { minQty: 1, price: 4500 },   // Retail price per unit
          { minQty: 10, price: 4100 },  // Tier 1 B2B bulk discount
          { minQty: 50, price: 3800 },  // Tier 2 high-volume discount
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      name: 'SikaGrout-214 PK',
      slug: 'sikagrout-214-pk',
      sku: 'SKU-214-25KG',
      description: 'One-part flowable shrink-compensated cementitious precision grout for machine foundations and anchor bolts.',
      packSize: '25 kg bag',
      inStock: true,
      stockQty: 200,
      featured: true,
      categoryId: concreteRepair.id,
      images: [
        'https://images.sika.com/placeholder.jpg',
      ],
      tdsUrl: 'https://pak.sika.com/tds/sikagrout-214-pk.pdf',
      sdsUrl: 'https://pak.sika.com/sds/sikagrout-214-pk.pdf',
      tieredPrices: {
        create: [
          { minQty: 1, price: 2800 },
          { minQty: 20, price: 2500 },
          { minQty: 100, price: 2200 },
        ],
      },
    },
  })

  await prisma.product.create({
    data: {
      name: 'Sika Ceram-102 PK',
      slug: 'sika-ceram-102-pk',
      sku: 'SKU-102-20KG',
      description: 'High-performance cementitious adhesive for ceramic tiles in indoor floors and walls.',
      packSize: '20 kg bag',
      inStock: true,
      stockQty: 300,
      featured: false,
      categoryId: tiling.id,
      images: [
        'https://images.sika.com/placeholder.jpg',
      ],
      tdsUrl: 'https://pak.sika.com/tds/sikaceram-102-pk.pdf',
      tieredPrices: {
        create: [
          { minQty: 1, price: 1650 },
          { minQty: 15, price: 1450 },
          { minQty: 50, price: 1300 },
        ],
      },
    },
  })

  console.log('Seeding initial test users...')

  // 3. Create Users (Admin, B2B, Retail)
  await prisma.user.create({
    data: {
      email: 'admin@sika.pk',
      name: 'Sika Super Admin',
      role: Role.ADMIN,
      phone: '+923001234567',
    },
  })

  await prisma.user.create({
    data: {
      email: 'contractor@buildcorp.pk',
      name: 'BuildCorp Pakistan',
      role: Role.B2B,
      companyName: 'BuildCorp Enterprises',
      ntnNumber: '7891234-5',
      phone: '+923219876543',
    },
  })

  await prisma.user.create({
    data: {
      email: 'customer@gmail.com',
      name: 'Test Customer',
      role: Role.CUSTOMER,
      phone: '+923335551212',
    },
  })

  console.log('✅ Database successfully seeded!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })