// /app/api/user/exists/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    return new Response(JSON.stringify({ exists: !!user }), { status: 200 });
}
