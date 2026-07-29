import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const isCliCommand = process.argv.some((arg) => 
  ["migrate", "db", "studio"].some((cmd) => arg.includes(cmd))
);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: isCliCommand && env("DIRECT_URL") ? env("DIRECT_URL") : env("DATABASE_URL"),
  },
});