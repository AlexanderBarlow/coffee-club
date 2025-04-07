import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
	try {
		const body = await req.json();

		const user = await prisma.user.upsert({
			where: { id: body.id },
			update: {}, // leave empty or update values here
			create: {
				id: body.id,
				email: body.email,
				tier: "BRONZE",
				points: 0,
				isAdmin: body.isAdmin || false,
			},
		});

		return new Response(JSON.stringify(user), { status: 200 });
	} catch (error) {
		console.error("❌ User creation failed:", error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
		});
	}
}
