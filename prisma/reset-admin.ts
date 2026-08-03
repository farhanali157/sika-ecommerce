import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "superadmin@sika.pk"
  const password = "SuperAdminPassword123!"
  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: Role.SUPER_ADMIN,
      passwordHash: passwordHash,
    },
    create: {
      name: "Sika Super Admin",
      email: email,
      passwordHash: passwordHash,
      role: Role.SUPER_ADMIN,
    },
  })

  console.log(`\nSuccess! Super Admin account updated:`)
  console.log(`Email:    ${user.email}`)
  console.log(`Password: ${password}\n`)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())