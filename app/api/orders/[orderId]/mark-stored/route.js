// /app/api/orders/[id]/mark-stored/route.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
    const { orderId } = await params;

    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { stored: true },
        });

        return new Response("OK");
    } catch (error) {
        console.error("Error updating order stored flag:", error);
        return new Response("Error", { status: 500 });
    }
}
