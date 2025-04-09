import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
	try {
		const drinks = await prisma.drink.findMany({
			where: { featured: true },
		});

		if (!drinks || drinks.length === 0) {
			return NextResponse.json(
				{ error: "No featured drinks found." },
				{ status: 404 }
			);
		}

		return NextResponse.json(drinks); // ✅ Return the full array
	} catch (error) {
		console.error("❌ Error fetching featured drinks:", error);
		return NextResponse.json(
			{ error: "Unable to fetch featured drinks." },
			{ status: 500 }
		);
	}
}
