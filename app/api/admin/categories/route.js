import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
	try {
		const categories = await prisma.category.findMany({
			orderBy: { createdAt: "desc" },
		});
		return Response.json(categories);
	} catch (err) {
		console.error("Failed to fetch categories:", err);
		return new Response("Failed to fetch categories", { status: 500 });
	}
}

export async function POST(req) {
	try {
		const { name, emoji } = await req.json();

		if (!name) {
			return new Response("Name is required", { status: 400 });
		}

		const newCategory = await prisma.category.create({
			data: { name, emoji },
		});

		return Response.json(newCategory);
	} catch (err) {
		console.error("Failed to create category:", err);
		return new Response("Failed to create category", { status: 500 });
	}
}
