import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function main() {
  console.log("🌱 Seeding roles...");

  // Create roles if they don't exist
  const roleNames = ["ADMIN", "BARISTA", "MANAGER", "SUPERVISOR"];
  const roles = {};

  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    roles[name] = role.id;
  }

  console.log("✅ Roles created or already exist.");

  // Seed or update one user per role
  const usersToSeed = [
    {
      id: "8436fd35-9b2d-44cc-92b2-c3e47d467297",
      email: "admin@coffeeclub.com",
      role: "ADMIN",
      employeeNumber: "CFA001",
      storeNumber: "0021",
    },
    {
      id: "b2b8e63e-a32a-44c0-a5a5-d4f75842e1dd",
      email: "barista@coffeeclub.com",
      role: "BARISTA",
      employeeNumber: "CFA002",
      storeNumber: "0021",
    },
    {
      id: "cdf78a0b-2cbb-4f89-8897-3a8a6f4e8d11",
      email: "manager@coffeeclub.com",
      role: "MANAGER",
      employeeNumber: "CFA003",
      storeNumber: "0021",
    },
    {
      id: "58a4b33d-d3e2-45c3-b9f2-9fd0b0c6930d",
      email: "supervisor@coffeeclub.com",
      role: "SUPERVISOR",
      employeeNumber: "CFA004",
      storeNumber: "0021",
    },
  ];

  for (const user of usersToSeed) {
    const existing = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (existing) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          email: user.email,
          tier: "VIP",
          points: 999,
          roleId: roles[user.role],
          employeeNumber: user.employeeNumber,
          storeNumber: user.storeNumber,
        },
      });

      console.log(`🔁 Updated ${user.role} user: ${user.email}`);
    } else {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          tier: "VIP",
          points: 999,
          roleId: roles[user.role],
          employeeNumber: user.employeeNumber,
          storeNumber: user.storeNumber,
        },
      });

      console.log(`✅ Created ${user.role} user: ${user.email}`);
    }
  }
}

main()
  .catch((err) => {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
