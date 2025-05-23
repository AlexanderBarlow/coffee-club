// /app/api/shifts/clock-in/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });
        }

        const existingShift = await prisma.shift.findFirst({
            where: { userId, endTime: null },
        });

        if (existingShift) {
            return new Response(JSON.stringify({ error: "Already clocked in." }), { status: 400 });
        }

        const newShift = await prisma.shift.create({
            data: {
                userId,
                startTime: new Date(),
                roleAtTime: "BARISTA", // Modify dynamically as needed
            },
        });

        return new Response(JSON.stringify(newShift), { status: 201 });
    } catch (err) {
        console.error("❌ Clock-in error:", err);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
