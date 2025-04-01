import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
	try {
		const body = await req.json(); // ✅ FIXED

		const newUser = await prisma.user.create({
			data: {
				id: body.id,
				email: body.email,
				tier: "BRONZE",
				points: 0,
			},
		});

		return new Response(JSON.stringify(newUser), { status: 200 });
	} catch (error) {
		if (error.code === "P2002" && error.meta?.target?.includes("email")) {
			return new Response(
				JSON.stringify({
					error:
						"Email already exists in the system under a different account.",
				}),
				{ status: 409 }
			);
		}

		console.error("❌ User creation failed:", error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
		});
	}
}
