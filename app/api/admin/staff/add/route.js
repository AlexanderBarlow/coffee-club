import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { email, role = "USER", employeeNumber, storeNumber } = await req.json();

        // Validate input
        if (!email || !role || !employeeNumber || !storeNumber) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // Get the role record
        const roleRecord = await prisma.role.findUnique({
            where: { name: role },
        });

        if (!roleRecord) {
            return new Response(JSON.stringify({ error: "Role not found" }), { status: 404 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            // Update existing user
            await prisma.user.update({
                where: { email },
                data: {
                    roleId: roleRecord.id,
                    employeeNumber,
                    storeNumber,
                },
            });

            return new Response(JSON.stringify({ message: "User updated successfully" }), { status: 200 });
        }

        // Create new user
        await prisma.user.create({
            data: {
                email,
                roleId: roleRecord.id,
                employeeNumber,
                storeNumber,
            },
        });

        return new Response(JSON.stringify({ message: "Staff member added" }), { status: 201 });
    } catch (error) {
        console.error("❌ Add staff error:", error);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
