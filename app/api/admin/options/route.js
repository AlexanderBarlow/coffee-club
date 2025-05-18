import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [syrups, sauces, milks] = await Promise.all([
      prisma.syrup.findMany({ orderBy: { name: "asc" } }),
      prisma.sauce.findMany({ orderBy: { name: "asc" } }),
      prisma.milk.findMany({ orderBy: { name: "asc" } }),
    ]);

    return new Response(JSON.stringify({ syrups, sauces, milks }), {
      status: 200,
    });
  } catch (err) {
    console.error("Failed to load customization options:", err);
    return new Response(
      JSON.stringify({ error: "Failed to load customization options." }),
      { status: 500 }
    );
  }
}
