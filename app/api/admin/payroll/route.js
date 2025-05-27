// app/api/admin/payroll/route.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const employee = searchParams.get("employee");
  const search = searchParams.get("search");

  // 1) Build user filter (role + optional email‐search + optional specific user)
  const userFilter = {
    role: { name: { not: "USER" } },
  };
  if (search) {
    userFilter.email = { contains: search, mode: "insensitive" };
  }
  if (employee && employee !== "all") {
    userFilter.id = employee;
  }

  // 2) Build payroll‐record filter (date range)
  const recordFilter = {};
  if (from || to) {
    recordFilter.payPeriodStart = {};
    if (from) recordFilter.payPeriodStart.gte = new Date(from);
    if (to) recordFilter.payPeriodStart.lte = new Date(to);
  }

  // 3) Fetch users with their latest matching payroll record
  const users = await prisma.user.findMany({
    where: userFilter,
    include: {
      payrollRecords: {
        where: recordFilter,
        orderBy: { payPeriodStart: "desc" },
        take: 1,
      },
    },
    orderBy: { email: "asc" },
  });

  // 4) Build periods array + running totals
  const periods = [];
  let totalPayroll = 0,
    totalHours = 0,
    totalOvertime = 0;

  users.forEach((u) => {
    const rec = u.payrollRecords[0];
    const hours = rec?.hoursWorked ?? 0;
    const overtime = rec?.overtimeHours ?? 0;
    const pay = rec?.totalPay ?? 0;
    const start = rec?.payPeriodStart?.toISOString() ?? "";
    const end = rec?.payPeriodEnd?.toISOString() ?? "";
    const status = pay > 0 ? "Pending" : "Paid";

    periods.push({
      id: u.id,
      dateRange: start && end ? `${start} – ${end}` : "",
      hours,
      overtime,
      totalPay: pay,
      status,
    });

    totalPayroll += pay;
    totalHours += hours;
    totalOvertime += overtime;
  });

  // 5) Compute your summary KPIs
  const summary = {
    totalPayroll,
    avgHours: users.length ? totalHours / users.length : 0,
    overtimePct: users.length
      ? Math.round((totalOvertime / totalHours) * 100)
      : 0,
    pendingAdj: periods.filter((p) => p.totalPay > 0).length,
  };

  return new Response(
    JSON.stringify({ summary, periods }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function POST() {
  // Zero-out all outstanding payroll
  await prisma.payroll.updateMany({
    where: { totalPay: { gt: 0 } },
    data: { hoursWorked: 0, overtimeHours: 0, totalPay: 0 },
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
