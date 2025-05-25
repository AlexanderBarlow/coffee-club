import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  // Return staff with their latest payroll record
  const users = await prisma.user.findMany({
    where: { role: { name: { not: "USER" } } },
    include: {
      payrollRecords: { orderBy: { payPeriodStart: "desc" }, take: 1 },
    },
    orderBy: { email: "asc" },
  });

  const data = users.map((u) => {
    const rec = u.payrollRecords[0] || {};
    return {
      id: u.id,
      email: u.email,
      hoursWorked: rec.hoursWorked || 0,
      hourlyRate: rec.hourlyRate || 0,
      totalPay: rec.totalPay || 0,
    };
  });

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST() {
  // Simulate pay: zero out all outstanding payroll
  await prisma.payroll.updateMany({
    where: { totalPay: { gt: 0 } },
    data: { hoursWorked: 0, totalPay: 0 },
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
