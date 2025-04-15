import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
	const { id } = params;

	try {
		const order = await prisma.order.findFirst({
			where: { userId: id },
			orderBy: { createdAt: "desc" },
		});

		if (!order) return new Response("No order found", { status: 404 });

		return new Response(JSON.stringify(order), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error("❌ Failed to fetch latest order:", err);
		return new Response("Server error", { status: 500 });
	}
}
