import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const category = searchParams.get("category");

	try {
		const drinks = await prisma.drink.findMany({
			where: category ? { category } : {}, // ✅ Only apply filter if category exists
		});

		return new Response(JSON.stringify(drinks), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error("❌ Failed to fetch drinks:", err);
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
		});
	}
}
