import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
	try {
		const orders = await prisma.order.findMany({
			include: {
				user: true, // include user info (like email) tied to the order
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return new Response(JSON.stringify(orders), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error("❌ Failed to fetch orders:", err);
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
		});
	}
}
