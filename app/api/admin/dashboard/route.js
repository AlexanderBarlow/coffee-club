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

    // 📈 Weekly revenue breakdown
    orders.forEach((o) => {
      const date = new Date(o.createdAt);
      if (date >= last7Days) {
        const label = date.toLocaleDateString("en-US", { weekday: "short" });
        weeklySales[label] += o.total;
      }
    });

    // 🔁 Repeat customers
    const orderCounts = {};
    for (const order of orders) {
      orderCounts[order.userId] = (orderCounts[order.userId] || 0) + 1;
    }
    const repeatCustomers = Object.values(orderCounts).filter(
      (count) => count > 1
    ).length;
    const uniqueCustomers = Object.keys(orderCounts).length;
    const repeatRate =
      uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;

    // 📦 Top Items
    const itemCounts = {};
    orders.forEach((order) => {
      try {
        const items = Array.isArray(order.items)
          ? order.items
          : JSON.parse(order.items);
        items.forEach((item) => {
          const key = item.name;
          itemCounts[key] = (itemCounts[key] || 0) + item.quantity || 1;
        });
      } catch (e) {
        console.warn("Failed to parse order items:", order.id);
      }
    });
    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // 💵 Avg ticket value
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // ⏱️ Avg ticket time
    const ticketDurations = orders.map(
      (o) => new Date(o.updatedAt) - new Date(o.createdAt)
    );
    const avgTicketTimeMs =
      ticketDurations.reduce((a, b) => a + b, 0) / ticketDurations.length || 0;
    const avgTicketTimeMinutes = Math.round(avgTicketTimeMs / 1000 / 60);

    // ⭐ Avg satisfaction rating
    const avgRatingResult = await prisma.review.aggregate({
      _avg: { rating: true },
    });

    return new Response(
      JSON.stringify({
        employeeCounts: roles,
        totalRevenue,
        totalOrders,
        weeklySalesData: weeklySales,
        topItems,
        repeatCustomers,
        repeatRate: parseFloat(repeatRate.toFixed(2)),
        avgTicket,
        avgTicketTimeMinutes,
        avgRating: avgRatingResult._avg.rating || null,
        uniqueCustomers,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Dashboard fetch failed" }), {
      status: 500,
    });
  }
}
