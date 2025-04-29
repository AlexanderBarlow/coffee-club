import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    const { orderId } = await params; // ✅ this is what was missing

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                review: true,
            },
        });

        if (!order) {
            return new Response(JSON.stringify({ error: "Order not found" }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify(order), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to fetch order:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
}
