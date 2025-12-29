import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@ayadis.local";
  const passwordHash = await bcrypt.hash("Admin1234!", 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      name: "Admin",
      providerApproved: true,
      visibleOnSite: false,
      addedByAdmin: true,
    },
  });

  const categories = ["Jardinage", "Bricolage", "Charpente", "Plomberie", "Électricité", "Ménage"];
  for (const name of categories) {
    await prisma.serviceCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Seed done. Admin:", adminEmail, "password: Admin1234!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
