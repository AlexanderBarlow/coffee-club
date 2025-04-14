import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
	try {
		const [syrups, sauces, milks] = await Promise.all([
			prisma.syrup.findMany(),
			prisma.sauce.findMany(),
			prisma.milk.findMany(),
		]);

		return new Response(JSON.stringify({ syrups, sauces, milks }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("❌ Error fetching options:", error);
		return new Response(JSON.stringify({ error: "Failed to load options" }), {
			status: 500,
		});
	}
}
