// File: app/api/admin/users/tier/route.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define tier progression order
const tiers = ["BRONZE", "SILVER", "GOLD", "VIP"];

export async function PATCH(req) {
    try {
        const { userId, direction } = await req.json();

        if (!userId || !["up", "down"].includes(direction)) {
            return new Response(JSON.stringify({ error: "Invalid input" }), {
                status: 400,
            });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        const currentIndex = tiers.indexOf(user.tier);
        const newIndex = direction === "up" ? currentIndex + 1 : currentIndex - 1;

        if (newIndex < 0 || newIndex >= tiers.length) {
            return new Response(
                JSON.stringify({ error: "Cannot change tier in that direction" }),
                { status: 400 }
            );
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { tier: tiers[newIndex] },
        });

        return new Response(JSON.stringify(updated), { status: 200 });
    } catch (err) {
        console.error("❌ Tier change error:", err);
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
        });
    }
}
