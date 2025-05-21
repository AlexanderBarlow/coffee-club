// File: app/api/admin/users/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: {
                role: true,
                orders: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const formatted = users.map((user) => ({
            id: user.id,
            email: user.email,
            tier: user.tier,
            points: user.points,
            role: user.role?.name || "USER",
            orderCount: user.orders.length,
            lastOrderDate: user.orders.length > 0 ? user.orders[user.orders.length - 1].createdAt : null,
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("❌ Failed to fetch users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
