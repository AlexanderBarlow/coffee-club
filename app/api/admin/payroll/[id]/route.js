// app/api/admin/payroll/[id]/route.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  // params.id is available synchronously
    const awaitParams = await params

  const userId = awaitParams.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId param." }), {
      status: 400,
    });
  }

  const { hoursWorked, hourlyRate } = await request.json();
  const hw = parseFloat(hoursWorked);
  const hr = parseFloat(hourlyRate);
  const totalPay = hw * hr;

  // Find the latest payroll record
  const record = await prisma.payroll.findFirst({
    where: { userId },
    orderBy: { payPeriodStart: "desc" },
  });
  if (!record) {
    return new Response(JSON.stringify({ error: "No payroll record found." }), {
      status: 404,
    });
  }

  // Update it in place
  const updated = await prisma.payroll.update({
    where: { id: record.id },
    data: { hoursWorked: hw, hourlyRate: hr, totalPay },
  });

  return new Response(JSON.stringify(updated), { status: 200 });
}
