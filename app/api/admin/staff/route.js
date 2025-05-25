// app/api/admin/staff/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: {
          name: {
            not: "USER",
          },
        },
      },
      include: {
        role: true,
        payrollRecords: {
          orderBy: { payPeriodStart: "desc" },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map to include only the latest payroll record
    const result = staff.map((user) => {
      const [latestPayroll] = user.payrollRecords;
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        payroll: latestPayroll || null,
      };
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch staff:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch staff." }), {
      status: 500,
    });
  }
}
