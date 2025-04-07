import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY // ✅ Use the secure admin key
);

async function main() {
	const email = "admin@coffeeclub.com";

	// 🔍 Get the user from Supabase Auth
	const { data, error } = await supabase.auth.admin.listUsers();

	if (error) {
		console.error("❌ Error fetching users:", error.message);
		process.exit(1);
	}

	const user = data.users.find((u) => u.email === email);

	if (!user) {
		console.error("❌ No Supabase user found with that email.");
		process.exit(1);
	}

	// ✅ Insert the correct user into Prisma
	await prisma.user.create({
		data: {
			id: user.id, // Must match Supabase Auth ID
			email: user.email,
			tier: "VIP",
			points: 0,
			isAdmin: true,
		},
	});

	console.log("✅ Synced user from Supabase to Prisma.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
