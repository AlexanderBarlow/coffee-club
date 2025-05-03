import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_, context) {
	const { params } = context;
	const { id } = await params;

	try {
		const orders = await prisma.order.findMany({
			where: { userId: id },
			orderBy: { createdAt: "desc" },
			include: {
				review: true, // ✅ fetch the single review related to the order
			},
		});

		return new Response(JSON.stringify(orders), { status: 200 });
	} catch (error) {
		console.error("❌ Failed to fetch user orders with review:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
			status: 500,
		});
	}
}
