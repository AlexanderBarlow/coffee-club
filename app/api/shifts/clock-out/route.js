// /app/api/shifts/clock-out/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req) {
    const body = await req.json();
    const { userId } = body;

    const activeShift = await prisma.shift.findFirst({
        where: { userId, endTime: null },
        orderBy: { startTime: "desc" },
    });

    if (!activeShift) {
        return new Response(JSON.stringify({ error: "No active shift found." }), { status: 404 });
    }

    const updatedShift = await prisma.shift.update({
        where: { id: activeShift.id },
        data: { endTime: new Date() },
    });

    return new Response(JSON.stringify(updatedShift), { status: 200 });
}
