import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function main() {
  console.log("🌱 Seeding roles...");

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

  console.log("✅ Roles created.");

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
    {
      id: "extra-barista-1",
      email: "barista2@coffeeclub.com",
      role: "BARISTA",
      employeeNumber: "CFA005",
      storeNumber: "0022",
    },
    {
      id: "extra-manager-1",
      email: "manager2@coffeeclub.com",
      role: "MANAGER",
      employeeNumber: "CFA006",
      storeNumber: "0022",
    },
  ];

  for (const user of usersToSeed) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        tier: "VIP",
        points: 999,
        roleId: roles[user.role],
        employeeNumber: user.employeeNumber,
        storeNumber: user.storeNumber,
      },
      create: {
        id: user.id,
        email: user.email,
        tier: "VIP",
        points: 999,
        roleId: roles[user.role],
        employeeNumber: user.employeeNumber,
        storeNumber: user.storeNumber,
      },
    });

    console.log(`✅ Created or updated ${user.role} user: ${user.email}`);
  }

  const baristaId = usersToSeed.find((u) => u.role === "BARISTA").id;
  const testUserId = usersToSeed.find((u) => u.role === "USER").id;

  const payrollDates = [
    { start: "2024-05-01", end: "2024-05-15" },
    { start: "2024-05-16", end: "2024-05-31" },
    { start: "2024-06-01", end: "2024-06-15" },
  ];

  for (const { start, end } of payrollDates) {
    await prisma.payroll.create({
      data: {
        userId: baristaId,
        hoursWorked: 80,
        hourlyRate: 15,
        totalPay: 1200,
        payPeriodStart: new Date(start),
        payPeriodEnd: new Date(end),
      },
    });

    for (let i = 0; i < 10; i++) {
      const shiftDate = new Date(start);
      shiftDate.setDate(shiftDate.getDate() + i);

      await prisma.shift.create({
        data: {
          userId: baristaId,
          startTime: new Date(shiftDate.setHours(8, 0, 0)),
          endTime: new Date(shiftDate.setHours(16, 0, 0)),
          roleAtTime: "BARISTA",
        },
      });
    }
  }

  await prisma.inventoryLog.create({
    data: {
      itemName: "Espresso Beans",
      quantity: 10,
      type: "restock",
      note: "Monthly restock",
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

  await prisma.storeMetricsSnapshot.create({
    data: {
      date: new Date(),
      totalRevenue: 850,
      totalOrders: 34,
      averageOrderValue: 25,
      totalLaborHours: 240,
    },
  });

  console.log("📊 Admin metrics and test data seeded.");
}

main()
  .catch((err) => {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
