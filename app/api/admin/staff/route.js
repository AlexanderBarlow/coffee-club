// app/api/admin/staff/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const staff = await prisma.user.findMany({
            where: {
                role: {
                    name: {
                        not: "USER", // Fetch everyone except regular users
                    },
                },
            },
            include: {
                role: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return new Response(JSON.stringify(staff), { status: 200 });
    } catch (error) {
        console.error("❌ Failed to fetch staff:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch staff." }),
            { status: 500 }
        );
    }
}
