import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const adminSupabaseUID = "8436fd35-9b2d-44cc-92b2-c3e47d467297"; // <-- put the real Supabase UID here
	const adminEmail = "admin@coffeeclub.com";

	const existing = await prisma.user.findUnique({
		where: { id: adminSupabaseUID },
	});

	if (existing) {
		console.log("⚠️ Admin user already seeded.");
		return;
	}

	const admin = await prisma.user.create({
		data: {
			id: adminSupabaseUID, // ⚡ Must match a real Supabase UID
			email: adminEmail,
			tier: "VIP",
			points: 999,
			isAdmin: true,
		},
	});

	console.log("✅ Admin user seeded successfully:", admin);
}

main()
	.catch((err) => {
		console.error("❌ Error seeding admin:", err);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
