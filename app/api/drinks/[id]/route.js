import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, context) {
  const params = await context.params;

  try {
    const drink = await prisma.drink.findUnique({
      where: { id: params.id },
      include: {
        syrups: true,
        sauces: true,
        milks: true,
      },
    });

    if (!drink) {
      return new Response(JSON.stringify({ error: "Drink not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(drink), { status: 200 });
  } catch (error) {
    console.error("❌ Drink fetch error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
