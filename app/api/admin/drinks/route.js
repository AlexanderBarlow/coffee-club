import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
	try {
		const drinks = await prisma.drink.findMany({
			include: {
				category: true, // bring category details if needed
			},
			orderBy: { createdAt: "desc" },
		});

		return Response.json(drinks);
	} catch (err) {
		console.error("Failed to fetch drinks:", err);
		return new Response("Failed to fetch drinks", { status: 500 });
	}
}

export async function POST(req) {
	try {
		const {
			name,
			description,
			price,
			categoryId,
			imageUrl,
			available,
			featured,
		} = await req.json();

		if (!name || !price || !categoryId) {
			return new Response("Missing required fields", { status: 400 });
		}

		const newDrink = await prisma.drink.create({
			data: {
				name,
				description,
				price,
				categoryId,
				imageUrl,
				available,
				featured,
			},
		});

		return Response.json(newDrink);
	} catch (err) {
		console.error("Failed to create drink:", err);
		return new Response("Failed to create drink", { status: 500 });
	}
}
