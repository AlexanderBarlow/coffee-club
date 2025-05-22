import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function main() {
  console.log("🌱 Seeding roles...");

  // Create roles if they don't exist
  const roleNames = ["ADMIN", "BARISTA", "MANAGER", "SUPERVISOR", "USER"];
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
    {
      id: "test-user-id-0001",
      email: "testuser@coffeeclub.com",
      role: "USER",
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

  const baristaId = usersToSeed.find((u) => u.role === "BARISTA").id;
  const testUserId = usersToSeed.find((u) => u.role === "USER").id;

  await prisma.payroll.create({
    data: {
      userId: baristaId,
      hoursWorked: 80,
      hourlyRate: 15,
      totalPay: 1200,
      payPeriodStart: new Date("2024-05-01"),
      payPeriodEnd: new Date("2024-05-15"),
    },
  });

  await prisma.inventoryLog.create({
    data: {
      itemName: "Espresso Beans",
      quantity: 10,
      type: "restock",
      note: "Monthly restock",
    },
  });

  await prisma.shift.create({
    data: {
      userId: baristaId,
      startTime: new Date(),
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      roleAtTime: "BARISTA",
    },
  });

  await prisma.customerActivity.create({
    data: {
      userId: baristaId,
      action: "review_submitted",
      detail: "5 stars for Caramel Latte",
    },
  });

  await prisma.rewardRedemption.create({
    data: {
      userId: baristaId,
      rewardName: "Free Coffee",
      pointsUsed: 100,
    },
  });

  await prisma.storeMetricsSnapshot.create({
    data: {
      date: new Date(),
      totalRevenue: 850,
      totalOrders: 34,
      averageOrderValue: 25,
      totalLaborHours: 16,
    },
  });

  // 💳 Add a completed order for test user
  const order = await prisma.order.create({
    data: {
      userId: testUserId,
      stripeSessionId: "test-session-001",
      items: [{ name: "Iced Mocha", quantity: 1, price: 5.5 }],
      total: 5.5,
      status: "COMPLETED",
      paymentStatus: "PAID",
    },
  });

  await prisma.review.create({
    data: {
      userId: testUserId,
      orderId: order.id,
      rating: 5,
      comment: "Amazing drink and fast service!",
    },
  });

  console.log("📊 Admin metrics and test user seeded.");
}

main()
  .catch((err) => {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
