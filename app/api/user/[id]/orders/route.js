import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_, context) {
	const { params } = context;
	const { id } =  await params;

	try {
		const orders = await prisma.order.findMany({
			where: { userId: id },
			orderBy: { createdAt: "desc" },
		});

		return new Response(JSON.stringify(orders), { status: 200 });
	} catch (error) {
		console.error("❌ Failed to fetch user orders:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
			status: 500,
		});
	}
}
