import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "iced";

  try {
    const drinks = await prisma.drink.findMany({
      where: {
        category: {
          equals: "iced",
        },
      },
    });


    return new Response(JSON.stringify(drinks), { status: 200 }); // ✅ must be an array
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
