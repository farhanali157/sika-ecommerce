import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts", // <-- Configured seed command for Prisma 7
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});