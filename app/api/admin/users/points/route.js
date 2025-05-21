// File: app/api/admin/users/points/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req) {
    try {
        const { userId, amount } = await req.json();

        if (!userId || typeof amount !== "number") {
            return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                points: {
                    increment: amount, // can be positive or negative
                },
            },
        });

        return new Response(JSON.stringify(updated), { status: 200 });
    } catch (err) {
        console.error("❌ Failed to update points:", err);
        return new Response("Server Error", { status: 500 });
    }
}
