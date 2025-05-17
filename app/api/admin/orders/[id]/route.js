import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  const { id } = params;

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: "IN_PROGRESS" },
    });

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return new Response(JSON.stringify({ error: "Failed to claim order" }), {
      status: 500,
    });
  }
}
