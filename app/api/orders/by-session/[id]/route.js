// app/api/orders/by-session/[id]/route.js

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findFirst({
      where: { stripeSessionId: id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("❌ Error fetching order by session:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
