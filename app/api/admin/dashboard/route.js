import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({ include: { role: true } });
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
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(now.getDate() - i);
      const label = day.toLocaleDateString("en-US", { weekday: "short" });
      weeklySales[label] = 0;
    }

    // Sales per day
    orders.forEach((o) => {
      const date = new Date(o.createdAt);
      if (date >= last7Days) {
        const label = date.toLocaleDateString("en-US", { weekday: "short" });
        weeklySales[label] += o.total;
      }
    });

    // Repeat customer stats
    const orderCounts = {};
    orders.forEach((order) => {
      orderCounts[order.userId] = (orderCounts[order.userId] || 0) + 1;
    });
    const repeatCustomers = Object.values(orderCounts).filter(
      (c) => c > 1
    ).length;
    const uniqueCustomers = Object.keys(orderCounts).length;
    const repeatRate =
      uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;

    // Top items
    const itemCounts = {};
    orders.forEach((order) => {
      try {
        const items = Array.isArray(order.items)
          ? order.items
          : JSON.parse(order.items);
        items.forEach((item) => {
          const key = item.name;
          const qty = item.quantity || 1;
          itemCounts[key] = (itemCounts[key] || 0) + qty;
        });
      } catch (e) {
        console.warn("❌ Failed to parse order items:", order.id);
      }
    });
    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Average ticket
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Avg order time
    const ticketDurations = orders.map(
      (o) => new Date(o.updatedAt) - new Date(o.createdAt)
    );
    const avgTicketTimeMs =
      ticketDurations.reduce((a, b) => a + b, 0) / ticketDurations.length || 0;
    const avgTicketTimeMinutes = Math.round(avgTicketTimeMs / 1000 / 60);

    // Avg rating
    const avgRatingResult = await prisma.review.aggregate({
      _avg: { rating: true },
    });

    // Total labor hours
    const shifts = await prisma.shift.findMany();
    const totalLaborHours = shifts.reduce((sum, shift) => {
      const start = new Date(shift.startTime);
      const end = new Date(shift.endTime);
      return sum + (end - start) / (1000 * 60 * 60);
    }, 0);

    // Inventory restocks per day
    const inventoryLogs = await prisma.inventoryLog.findMany();
    const inventoryRestocks = {};
    inventoryLogs.forEach((log) => {
      const date = new Date(log.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      });
      if (log.type === "restock") {
        inventoryRestocks[date] = (inventoryRestocks[date] || 0) + log.quantity;
      }
    });

    // Reward redemptions
    const rewardRedemptions = await prisma.rewardRedemption.findMany();
    const rewardData = {};
    rewardRedemptions.forEach((r) => {
      const name = r.rewardName;
      rewardData[name] = (rewardData[name] || 0) + 1;
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

        totalLaborHours: Math.round(totalLaborHours),
        inventoryRestocks,
        rewardRedemptions: rewardData,
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
