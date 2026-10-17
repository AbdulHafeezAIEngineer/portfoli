import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { strongPassword } from "../lib/admin/password";
import { site } from "../data/site";
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (
    !process.env.DATABASE_URL ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    !password ||
    !strongPassword(password)
  )
    throw new Error("Invalid private bootstrap settings.");
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    log: [],
  });
  try {
    const passwordHash = await hash(password, 12);
    await db.$transaction(
      async (tx) => {
        if (await tx.adminUser.count())
          throw new Error(
            "An administrator already exists. Use documented recovery.",
          );
        await tx.adminUser.create({ data: { email, passwordHash } });
        await tx.siteSettings.upsert({
          where: { id: "main" },
          update: {},
          create: {
            id: "main",
            brand: site.brand,
            email: site.email,
            title: site.title,
            description: site.description,
          },
        });
      },
      { isolationLevel: "Serializable" },
    );
    console.log(
      "Initial administrator created. No credentials were printed. Remove ADMIN_PASSWORD from the runtime environment.",
    );
  } finally {
    await db.$disconnect();
  }
}
main().catch(() => {
  console.error(
    "Bootstrap refused or failed. Check the database, password requirements and whether an administrator already exists. No credentials were printed.",
  );
  process.exitCode = 1;
});
