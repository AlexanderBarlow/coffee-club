import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const category = searchParams.get("category");

	try {
		const drinks = await prisma.drink.findMany({
			where: category
				? {
						category: {
<<<<<<< HEAD
							name: category,
=======
							name: category, // ✅ Correct: search by related Category's name
>>>>>>> 4614f86 (initial commit)
						},
				  }
				: {},
			include: {
<<<<<<< HEAD
				category: true,
				syrups: true, // 🧠 directly include syrups
				sauces: true, // 🧠 directly include sauces
				milks: true, // 🧠 directly include milks
=======
				category: true, // Optional: include category info if you want it
>>>>>>> 4614f86 (initial commit)
			},
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
