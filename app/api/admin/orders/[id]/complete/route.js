import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  const { id } = await params;

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Error completing order:", error);
    return new Response(JSON.stringify({ error: "Failed to complete order" }), {
      status: 500,
    });
  }
}
