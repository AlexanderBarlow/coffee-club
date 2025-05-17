import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { employeeNumber, storeNumber } = await req.json();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findFirst({
    where: {
      id: user.id,
      employeeNumber,
      storeNumber,
      role: { name: { not: "USER" } },
    },
    include: { role: true },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  console.log("✅ Verified role:", dbUser.role.name);

  // ✅ Create response
  const res = NextResponse.json(
    { message: "Verified", role: dbUser.role.name },
    { status: 200 }
  );

  // ✅ Set cookie
  res.cookies.set("staff_verified", "true", {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: true,
  });

  return res;
}
