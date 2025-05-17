import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    // Find the default USER role
    const defaultRole = await prisma.role.findUnique({
      where: { name: "USER" }, // assumes role table is pre-seeded
    });

    if (!defaultRole) {
      console.error("❌ Default USER role not found.");
      return new Response(JSON.stringify({ error: "USER role missing" }), {
        status: 500,
      });
    }

    const user = await prisma.user.upsert({
      where: { id: body.id },
      update: {}, // You can modify fields if needed here
      create: {
        id: body.id,
        email: body.email,
        tier: "BRONZE",
        points: 0,
        roleId: defaultRole.id,
        employeeNumber: null,
        storeNumber: null,
      },
    });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("❌ User creation failed:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
