import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req) {

    try {
        const { userId, newRole } = await req.json();

        if (!userId || !newRole) {
            return new Response(JSON.stringify({ error: "Missing userId or newRole" }), {
                status: 400,
            });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        console.log(user);

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        const role = await prisma.role.findUnique({ where: { name: newRole } });

        if (!role) {
            return new Response(JSON.stringify({ error: "Role not found" }), {
                status: 404,
            });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { roleId: role.id },
        });

        return new Response(JSON.stringify({ message: "User role updated" }), { status: 200 });
    } catch (error) {
        console.error("❌ Promote error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
