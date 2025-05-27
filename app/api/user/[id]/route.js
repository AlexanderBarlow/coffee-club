// /app/api/user/[id]/route.js
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;

  // 1) Make sure we have a secret
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("⚠️ JWT_SECRET is not set");
    return NextResponse.json(
      { error: "Server misconfiguration: missing JWT_SECRET" },
      { status: 500 }
    );
  }

  try {
    // 2) Look up the user & role
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 3) Sign a JWT
    const token = jwt.sign(
      { sub: user.id, role: user.role?.name },
      secret,
      { expiresIn: "1h" }
    );

    // 4) Build our response payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      tier: user.tier,
      points: user.points,
      token,   // <-- included in response JSON too
    };

    // 5) Create NextResponse and set the cookie
    const res = NextResponse.json(payload, { status: 200 });
    res.cookies.set("cc_token", token, {
      path: "/",        // available across the app
      maxAge: 60 * 60,  // 1 hour
      httpOnly: false,  // so client JS can read it (if you want httpOnly, set to true)
    });

    return res;
  } catch (error) {
    console.error("GET /api/user/[id] error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
