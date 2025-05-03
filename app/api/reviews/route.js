import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { orderId, userId, rating, comment } = body;

        if (!orderId || !userId || !rating) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const review = await prisma.review.create({
            data: {
                orderId,
                userId,
                rating,
                comment,
            },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error("Review error:", error);
        return NextResponse.json(
            { error: "Something went wrong creating the review." },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const reviews = await prisma.review.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
            },
        });

        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.error("Fetch reviews error:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews." },
            { status: 500 }
        );
    }
}
