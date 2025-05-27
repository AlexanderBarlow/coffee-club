// app/api/admin/payroll/route.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request) {
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const employee = url.searchParams.get("employee");
  const search = url.searchParams.get("search")?.toLowerCase() || "";

  // Build Prisma "where" clause
  const where = {};
  if (from || to) {
    where.payPeriodStart = {};
    if (from) where.payPeriodStart.gte = new Date(from);
    if (to) where.payPeriodEnd.lte = new Date(to);
  }
  if (employee && employee !== "all") {
    where.userId = employee;
  }
  if (search) {
    where.user = {
      email: { contains: search, mode: "insensitive" },
    };
  }

  // Fetch all matching payroll records, with user email
  const records = await prisma.payroll.findMany({
    where,
    include: { user: { select: { id: true, email: true } } },
    orderBy: { payPeriodStart: "desc" },
  });

  // 1) SUMMARY
  const totalPaySum = records.reduce((sum, r) => sum + (r.totalPay || 0), 0);
  const totalHoursSum = records.reduce(
    (sum, r) => sum + (r.hoursWorked || 0),
    0
  );
  const count = records.length;
  const summary = {
    totalPayroll: totalPaySum,
    avgHours: count ? +(totalHoursSum / count).toFixed(1) : 0,
    overtimePct: 0, // placeholder — compute if you track OT
    pendingAdj: 0, // placeholder — compute if you add an Adjustment model
  };

  // 2) TREND DATA (group by YYYY-MM)
  const trendMap = {};
  records.forEach((r) => {
    const key = r.payPeriodStart.toISOString().slice(0, 7); // "2025-05"
    if (!trendMap[key]) trendMap[key] = { hours: 0, pay: 0 };
    trendMap[key].hours += r.hoursWorked || 0;
    trendMap[key].pay += r.totalPay || 0;
  });
  const trendData = Object.entries(trendMap).map(([period, vals]) => ({
    period,
    hours: vals.hours,
    totalPay: vals.pay,
  }));

  // 3) PERIODS LIST
  const periods = records.map((r, i) => ({
    id: r.id,
    period: i + 1,
    dateRange: `${r.payPeriodStart.toISOString().split("T")[0]} – ${
      r.payPeriodEnd.toISOString().split("T")[0]
    }`,
    totalPay: r.totalPay,
    hours: r.hoursWorked,
    status: r.totalPay > 0 ? "Unpaid" : "Paid",
  }));

  return new Response(JSON.stringify({ summary, trendData, periods }), {
    status: 200,
  });
}

export async function POST() {
  // Simulate pay: zero out all outstanding payroll
  await prisma.payroll.updateMany({
    where: { totalPay: { gt: 0 } },
    data: { hoursWorked: 0, totalPay: 0 },
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
