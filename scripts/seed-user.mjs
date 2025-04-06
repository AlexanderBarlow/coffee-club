import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const adminEmail = "admin@coffeeclub.com";

	const existing = await prisma.user.findUnique({
		where: { email: adminEmail },
	});

	if (existing) {
		console.log("⚠️ Admin user already exists.");
		return;
	}

	const admin = await prisma.user.create({
		data: {
			id: "admin-id-123", // You can match this to Supabase UID if needed
            email: adminEmail,
			tier: "VIP",
			points: 999,
		},
	});

	console.log("✅ Admin user created:", admin);
}

main()
	.catch((err) => {
		console.error("❌ Error seeding admin:", err);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
