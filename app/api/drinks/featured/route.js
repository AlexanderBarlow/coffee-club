import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
	try {
		const drinks = await prisma.drink.findMany({
			where: { featured: true },
		});

		if (drinks.length === 0) {
			return NextResponse.json(
				{ error: "No featured drink found." },
				{ status: 404 }
			);
		}

		return NextResponse.json(drinks[0]); // 👈 or send back the array if you want multiple
	} catch (error) {
		console.error("❌ Error fetching featured drink:", error);
		return NextResponse.json(
			{ error: "Unable to fetch featured drink." },
			{ status: 500 }
		);
	}
}
