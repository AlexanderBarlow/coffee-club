// /app/api/shifts/active/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return new Response(JSON.stringify({ error: "Missing userId" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const shift = await prisma.shift.findFirst({
            where: {
                userId,
                endTime: null, // ✅ Correct null check
            },
        });


        return new Response(JSON.stringify({ activeShift: shift }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("❌ Failed to fetch active shift:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
