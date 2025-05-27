// prisma/seed.js

import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Roles…");
  const roleNames = ["ADMIN", "BARISTA", "MANAGER", "SUPERVISOR", "USER"];
  const roles = {};
  for (const name of roleNames) {
    const r = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    roles[name] = r.id;
  }
  console.log("✅ Roles done.");

  const usersData = [
    {
      email: "admin@coffeeclub.com",
      role: "ADMIN",
      empNum: "CFA001",
      store: "0021",
    },
    {
      email: "barista@coffeeclub.com",
      role: "BARISTA",
      empNum: "CFA002",
      store: "0021",
    },
    {
      email: "manager@coffeeclub.com",
      role: "MANAGER",
      empNum: "CFA003",
      store: "0021",
    },
    {
      email: "supervisor@coffeeclub.com",
      role: "SUPERVISOR",
      empNum: "CFA004",
      store: "0021",
    },
    {
      email: "barista2@coffeeclub.com",
      role: "BARISTA",
      empNum: "CFA005",
      store: "0022",
    },
    {
      email: "manager2@coffeeclub.com",
      role: "MANAGER",
      empNum: "CFA006",
      store: "0022",
    },
    { email: "testuser@coffeeclub.com", role: "USER" },
  ];

  console.log("🌱 Seeding Users…");
  for (const u of usersData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        roleId: roles[u.role],
        employeeNumber: u.empNum,
        storeNumber: u.store,
        tier: "VIP",
        points: 500,
      },
      create: {
        email: u.email,
        roleId: roles[u.role],
        employeeNumber: u.empNum,
        storeNumber: u.store,
        tier: "VIP",
        points: 500,
      },
    });
    console.log(`✅ ${u.email}`);
  }

  // pick one barista to seed payroll for
  const barista = await prisma.user.findUnique({
    where: { email: "barista@coffeeclub.com" },
  });

  console.log("🌱 Seeding Payroll + Adjustments for the last 2 months…");
  const payrollPeriods = [
    { start: new Date("2025-04-01"), end: new Date("2025-04-15") },
    { start: new Date("2025-04-16"), end: new Date("2025-04-30") },
    { start: new Date("2025-05-01"), end: new Date("2025-05-15") },
    { start: new Date("2025-05-16"), end: new Date("2025-05-31") },
  ];

  for (const period of payrollPeriods) {
    // simulate some variation
    const hrs = 80 + Math.floor(Math.random() * 16) - 8; // 72–88
    const ot = hrs > 80 ? hrs - 80 : 0; // overtime above 80h
    const reg = hrs - ot;
    const rate = 15;
    const otRate = 22.5; // 1.5×
    const totalPay = reg * rate + ot * otRate;

    const pr = await prisma.payroll.create({
      data: {
        userId: barista.id,
        hoursWorked: hrs,
        regularHours: reg,
        overtimeHours: ot,
        hourlyRate: rate,
        overtimeRate: otRate,
        totalPay,
        payPeriodStart: period.start,
        payPeriodEnd: period.end,
      },
    });

    // add a bonus adjustment for every second period
    if (Math.random() < 0.5) {
      await prisma.payrollAdjustment.create({
        data: {
          payrollId: pr.id,
          type: "BONUS",
          amount: 50,
          note: "Performance bonus",
        },
      });
    }
    // add a deduction for half the periods
    if (Math.random() < 0.5) {
      await prisma.payrollAdjustment.create({
        data: {
          payrollId: pr.id,
          type: "DEDUCTION",
          amount: 20,
          note: "Uniform fee",
        },
      });
    }

    // create sample shifts for each day in that period
    let cur = new Date(period.start);
    while (cur <= period.end) {
      const shiftStart = new Date(cur);
      shiftStart.setHours(8, 0, 0);
      const shiftEnd = new Date(cur);
      shiftEnd.setHours(16, 0, 0);
      await prisma.shift.create({
        data: {
          userId: barista.id,
          startTime: shiftStart,
          endTime: shiftEnd,
          roleAtTime: "BARISTA",
        },
      });
      cur.setDate(cur.getDate() + 1);
    }
  }

  console.log("✅ Payroll + adjustments seeded.");

  console.log("🌱 Seeding sample orders & reviews…");
  const testUser = await prisma.user.findUnique({
    where: { email: "testuser@coffeeclub.com" },
  });

  const order = await prisma.order.create({
    data: {
      userId: testUser.id,
      stripeSessionId: "sess_1234",
      items: [{ name: "Cappuccino", qty: 2, price: 4.5 }],
      total: 9.0,
      status: "COMPLETED",
      paymentStatus: "PAID",
    },
  });
  await prisma.review.create({
    data: {
      userId: testUser.id,
      orderId: order.id,
      rating: 5,
      comment: "Best coffee in town!",
    },
  });
  console.log("✅ Orders & reviews");

  console.log("🌱 Seeding inventory & metrics…");
  await prisma.inventoryLog.create({
    data: {
      itemName: "Coffee Beans",
      quantity: 30,
      type: "restock",
      note: "Monthly restock",
    },
  });
  await prisma.storeMetricsSnapshot.createMany({
    data: [
      {
        date: new Date("2025-04-30"),
        totalRevenue: 12000,
        totalOrders: 400,
        averageOrderValue: 30,
        totalLaborHours: 320,
      },
      {
        date: new Date("2025-05-31"),
        totalRevenue: 15000,
        totalOrders: 500,
        averageOrderValue: 30,
        totalLaborHours: 350,
      },
    ],
  });
  console.log("✅ Inventory & metrics");

  console.log("🎉 Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
