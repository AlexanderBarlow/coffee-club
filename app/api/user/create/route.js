// app/api/user/create/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    const newUser = await prisma.user.create({
      data: {
        id: body.id, // Supabase Auth ID
        email: body.email,
        tier: "BRONZE",
        points: 0,
      },
    });

    return new Response(JSON.stringify(newUser), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
