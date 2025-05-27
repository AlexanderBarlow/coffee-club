// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import { addYears, addDays, startOfDay } from "date-fns";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Roles…");
  const roleNames = ["ADMIN","BARISTA","MANAGER","SUPERVISOR","USER"];
  const roles = {};
  for (const name of roleNames) {
    const r = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    roles[name] = r.id;
  }

  console.log("🌱 Seeding Users…");
  const usersData = [
    { email:"admin@coffeeclub.com",     role:"ADMIN",      empNum:"CFA001", store:"0021" },
    { email:"barista@coffeeclub.com",   role:"BARISTA",    empNum:"CFA002", store:"0021" },
    { email:"manager@coffeeclub.com",   role:"MANAGER",    empNum:"CFA003", store:"0021" },
    { email:"supervisor@coffeeclub.com",role:"SUPERVISOR", empNum:"CFA004", store:"0021" },
    { email:"barista2@coffeeclub.com",  role:"BARISTA",    empNum:"CFA005", store:"0022" },
    { email:"manager2@coffeeclub.com",  role:"MANAGER",    empNum:"CFA006", store:"0022" },
    { email:"testuser@coffeeclub.com",  role:"USER" },
  ];

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
  }

  // define pay rates per role
  const roleRates = {
    BARISTA:    { rate: 15, overtimeMultiplier: 1.5 },
    MANAGER:    { rate: 25, overtimeMultiplier: 1.25 },
    SUPERVISOR: { rate: 20, overtimeMultiplier: 1.5 },
    ADMIN:      { rate: 0,  overtimeMultiplier: 1 },
  };

  console.log("🌱 Generating 2 years of payroll for all staff…");
  // building periods
  let periodStart = startOfDay(addYears(new Date(), -2));
  const today = new Date();
  const periods = [];
  while (periodStart < today) {
    const mid = addDays(periodStart, 14);
    const end = addDays(periodStart, 29);
    periods.push({ start: periodStart, end: mid });
    periods.push({ start: addDays(mid, 1), end });
    periodStart = addDays(end, 1);
  }
  periods.forEach(p => { if (p.end > today) p.end = today });

  // fetch all non-USER staff
  const staff = await prisma.user.findMany({
    where: { role: { name: { not: "USER" } } },
    include: { role: true },
  });

  for (const member of staff) {
    const { name } = member.role!;
    const { rate, overtimeMultiplier } = roleRates[name] || { rate: 0, overtimeMultiplier: 1 };

    for (const p of periods) {
      // random hours between 70–90 for non-admin; admin gets zero
      const hrs = name === "ADMIN" ? 0 : 70 + Math.floor(Math.random() * 21);
      const ot  = name === "ADMIN" ? 0 : Math.max(0, hrs - 80);
      const reg = hrs - ot;
      const totalPay = reg * rate + ot * rate * overtimeMultiplier;

      await prisma.payroll.create({
        data: {
          userId: member.id,
          hoursWorked: hrs,
          regularHours: reg,
          overtimeHours: ot,
          hourlyRate: rate,
          overtimeRate: name === "ADMIN" ? null : rate * overtimeMultiplier,
          totalPay,
          payPeriodStart: p.start,
          payPeriodEnd: p.end,
        },
      });
    }
  }

  console.log("✅ Done seeding payroll for all staff.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
