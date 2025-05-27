// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import { addYears, addDays, startOfDay, endOfMonth } from "date-fns";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  // 1) Roles
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

  // 2) Users
  const users = [
    { email: "admin@coffeeclub.com", role: "ADMIN", emp: "CFA001", st: "0021" },
    { email: "barista@coffeeclub.com", role: "BARISTA", emp: "CFA002", st: "0021" },
    { email: "manager@coffeeclub.com", role: "MANAGER", emp: "CFA003", st: "0021" },
    { email: "supervisor@coffeeclub.com", role: "SUPERVISOR", emp: "CFA004", st: "0021" },
    { email: "testuser@coffeeclub.com", role: "USER" },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        roleId: roles[u.role],
        employeeNumber: u.emp,
        storeNumber: u.st,
        tier: "VIP",
        points: 500,
      },
      create: {
        email: u.email,
        roleId: roles[u.role],
        employeeNumber: u.emp,
        storeNumber: u.st,
        tier: "VIP",
        points: 500,
      },
    });
  }

  // 3) Monthly snapshots (2 years)
  console.log("🌱 Seeding 24 monthly StoreMetricsSnapshot…");
  let cursor = startOfDay(addYears(new Date(), -2));
  const today = new Date();
  const snapshots = [];
  while (cursor < today) {
    const monthEnd = endOfMonth(cursor);
    snapshots.push({
      date: monthEnd,
      totalRevenue: 5000 + Math.random() * 5000, // $5k–10k
      totalOrders: 200 + Math.floor(Math.random() * 100), // 200–300 orders
      averageOrderValue: 15 + Math.random() * 10, // $15–25
      totalLaborHours: 300 + Math.random() * 100, // 300–400 hrs
    });
    // next month
    cursor = addDays(monthEnd, 1);
  }
  await prisma.storeMetricsSnapshot.createMany({
    data: snapshots,
    skipDuplicates: true,
  });

  // 4) Payroll & shifts (same 48 periods per staff)
  console.log("🌱 Seeding payroll & shifts…");
  const staff = await prisma.user.findMany({
    where: { role: { name: { not: "USER" } } },
    include: { role: true },
  });

  // define pay rates
  const roleRates = {
    BARISTA: { rate: 15, mult: 1.5 },
    MANAGER: { rate: 25, mult: 1.25 },
    SUPERVISOR: { rate: 20, mult: 1.5 },
    ADMIN: { rate: 0, mult: 1 },
  };

  // build the 48 half-month periods
  let pStart = startOfDay(addYears(new Date(), -2));
  const periods = [];
  while (pStart < today) {
    const mid = addDays(pStart, 14), end = addDays(pStart, 29);
    periods.push([pStart, mid]);
    periods.push([addDays(mid, 1), end > today ? today : end]);
    pStart = addDays(end, 1);
  }

  for (const member of staff) {
    const rn = member.role.name;
    const { rate, mult } = roleRates[rn] || { rate: 0, mult: 1 };
    const payrollBatch = [];
    const shiftBatch = [];

    for (const [s, e] of periods) {
      const hrs = rn === "ADMIN" ? 0 : 70 + Math.floor(Math.random() * 21);
      const ot = rn === "ADMIN" ? 0 : Math.max(0, hrs - 80);
      const reg = hrs - ot;
      const total = reg * rate + ot * rate * mult;

      payrollBatch.push({
        userId: member.id,
        hoursWorked: hrs,
        regularHours: reg,
        overtimeHours: ot,
        hourlyRate: rate,
        overtimeRate: rn === "ADMIN" ? null : rate * mult,
        totalPay: total,
        payPeriodStart: s,
        payPeriodEnd: e,
      });

      // one dummy shift per period
      shiftBatch.push({
        userId: member.id,
        startTime: s,
        endTime: e,
        roleAtTime: rn,
      });
    }
    await prisma.payroll.createMany({ data: payrollBatch, skipDuplicates: true });
    await prisma.shift.createMany({ data: shiftBatch, skipDuplicates: true });
  }

  console.log("✅ Fast seed complete.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
