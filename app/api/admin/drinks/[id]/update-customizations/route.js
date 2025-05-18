import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  const drinkId = params.id;

  try {
    const body = await req.json();
    const { syrupIds = [], sauceIds = [], milkIds = [], sizes = [] } = body;

    // Validate drink exists
    const drink = await prisma.drink.findUnique({ where: { id: drinkId } });
    if (!drink) {
      return NextResponse.json({ error: "Drink not found" }, { status: 404 });
    }

    // Update relations
    await prisma.drink.update({
      where: { id: drinkId },
      data: {
        syrups: {
          set: syrupIds.map((id) => ({ id })),
        },
        sauces: {
          set: sauceIds.map((id) => ({ id })),
        },
        milks: {
          set: milkIds.map((id) => ({ id })),
        },
        customizeOptions: {
          set: sizes, // stored as JSON
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update drink customization error:", err);
    return NextResponse.json(
      { error: "Failed to update customizations" },
      { status: 500 }
    );
  }
}
