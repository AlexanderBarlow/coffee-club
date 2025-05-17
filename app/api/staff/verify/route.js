import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req) {
  const { employeeNumber, storeNumber } = await req.json();

  try {
    const user = await prisma.user.findFirst({
      where: {
        employeeNumber,
        storeNumber,
        role: {
          name: {
            not: "USER", // Ensures only staff roles qualify
          },
        },
      },
      include: { role: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    return new Response(
      JSON.stringify({ message: "Verified", role: user.role.name }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
