import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    const { id } = await params;

    try {
        const reviews = await prisma.review.findMany({
            where: { userId: id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.error("Review fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}
