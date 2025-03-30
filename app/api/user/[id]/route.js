import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.length - 1]; // safely gets [id] from the path

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
