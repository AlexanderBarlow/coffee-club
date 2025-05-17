import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
    });

    const roles = users.reduce((acc, user) => {
      const roleName = user.role?.name || "UNKNOWN";
      acc[roleName] = (acc[roleName] || 0) + 1;
      return acc;
    }, {});

    const orders = await prisma.order.findMany({
      where: { status: "COMPLETED" },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;

    const now = new Date();
    const last7Days = new Date(now);
    last7Days.setDate(now.getDate() - 6);

    const weeklySales = {};
    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(now.getDate() - i);
      const label = day.toLocaleDateString("en-US", { weekday: "short" });
      weeklySales[label] = 0;
    }

    orders.forEach((o) => {
      const date = new Date(o.createdAt);
      if (date >= last7Days) {
        const label = date.toLocaleDateString("en-US", { weekday: "short" });
        weeklySales[label] += o.total;
      }
    });

    return new Response(
      JSON.stringify({
        employeeCounts: roles,
        totalRevenue,
        totalOrders,
        weeklySalesData: weeklySales,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Dashboard fetch failed" }), {
      status: 500,
    });
  }
}
