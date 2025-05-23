import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const prisma = new PrismaClient();
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
      email: "admin@coffeeclub.com",
      role: "ADMIN",
      employeeNumber: "CFA001",
      storeNumber: "0021",
    },
    {
      email: "barista@coffeeclub.com",
      role: "BARISTA",
      employeeNumber: "CFA002",
      storeNumber: "0021",
    },
    {
      email: "manager@coffeeclub.com",
      role: "MANAGER",
      employeeNumber: "CFA003",
      storeNumber: "0021",
    },
    {
      email: "supervisor@coffeeclub.com",
      role: "SUPERVISOR",
      employeeNumber: "CFA004",
      storeNumber: "0021",
    },
    {
      email: "testuser@coffeeclub.com",
      role: "USER",
    },
    {
      email: "barista2@coffeeclub.com",
      role: "BARISTA",
      employeeNumber: "CFA005",
      storeNumber: "0022",
    },
    {
      email: "manager2@coffeeclub.com",
      role: "MANAGER",
      employeeNumber: "CFA006",
      storeNumber: "0022",
    },
  ];

  for (const user of usersToSeed) {
    try {
      await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: "password123!",
        email_confirm: true,
      });
      console.log(`✅ Supabase user created: ${user.email}`);
    } catch (e) {
      if (e instanceof Error && e.message.includes("already been registered")) {
        console.log(`⚠️ Supabase user already exists: ${user.email}`);
      } else {
        throw e;
      }
    }

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        tier: "VIP",
        points: 999,
        roleId: roles[user.role],
        employeeNumber: user.employeeNumber,
        storeNumber: user.storeNumber,
      },
      create: {
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

  const barista = await prisma.user.findFirst({ where: { email: "barista@coffeeclub.com" } });
  const testUser = await prisma.user.findFirst({ where: { email: "testuser@coffeeclub.com" } });

  const payrollDates = [
    { start: "2024-05-01", end: "2024-05-15" },
    { start: "2024-05-16", end: "2024-05-31" },
    { start: "2024-06-01", end: "2024-06-15" },
  ];

  for (const { start, end } of payrollDates) {
    await prisma.payroll.create({
      data: {
        userId: barista.id,
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
          userId: barista.id,
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
      userId: barista.id,
      action: "review_submitted",
      detail: "5 stars for Caramel Latte",
    },
  });

  await prisma.rewardRedemption.create({
    data: {
      userId: barista.id,
      rewardName: "Free Coffee",
      pointsUsed: 100,
    },
  });

  const order = await prisma.order.create({
    data: {
      userId: testUser.id,
      stripeSessionId: "test-session-001",
      items: [{ name: "Iced Mocha", quantity: 1, price: 5.5 }],
      total: 5.5,
      status: "COMPLETED",
      paymentStatus: "PAID",
    },
  });

  await prisma.review.create({
    data: {
      userId: testUser.id,
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
