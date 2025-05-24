import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    // Ensure role exists
    const defaultRole = await prisma.role.findUnique({
      where: { name: "USER" },
    });

    if (!defaultRole) {
      return new Response(JSON.stringify({ error: "USER role missing" }), {
        status: 500,
      });
    }

    // 🔍 Check if user already exists by email
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return new Response(JSON.stringify(existingUser), { status: 200 });
    }

    // ✅ Create new user
    const newUser = await prisma.user.create({
      data: {
        id: body.id,
        email: body.email,
        tier: "BRONZE",
        points: 0,
        roleId: defaultRole.id,
        employeeNumber: null,
        storeNumber: null,
      },
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.error("❌ User creation failed:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
