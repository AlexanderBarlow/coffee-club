// app/api/admin/payroll/[id]/route.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  const userId = await params.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId param." }), {
      status: 400,
    });
  }

  const { hoursWorked, hourlyRate } = await request.json();
  const hw = parseFloat(hoursWorked);
  const hr = parseFloat(hourlyRate);
  const totalPay = hw * hr;

  // Try to find the latest payroll record
  const record = await prisma.payroll.findFirst({
    where: { userId },
    orderBy: { payPeriodStart: "desc" },
  });

  if (record) {
    // Update existing
    const updated = await prisma.payroll.update({
      where: { id: record.id },
      data: { hoursWorked: hw, hourlyRate: hr, totalPay },
    });
    return new Response(JSON.stringify(updated), { status: 200 });
  } else {
    // Create new if none found
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const newRecord = await prisma.payroll.create({
      data: {
        userId,
        hoursWorked: hw,
        hourlyRate: hr,
        totalPay,
        payPeriodStart: periodStart,
        payPeriodEnd: now,
      },
    });
    return new Response(JSON.stringify(newRecord), { status: 201 });
  }
}
