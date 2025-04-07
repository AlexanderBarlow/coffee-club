import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
	try {
		const body = await req.json();
		const drink = await prisma.drink.create({
			data: {
				name: body.name,
				description: body.description,
				price: body.price,
				category: body.category,
				imageUrl: body.imageUrl || null,
				available: body.available ?? true,
				featured: body.featured ?? false,
			},
		});

		return new Response(JSON.stringify(drink), { status: 200 });
	} catch (error) {
		console.error("❌ Error creating drink:", error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
		});
	}
}
