import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const drinks = [
		{
			name: "Iced Vanilla Latte",
			description: "Chilled espresso with milk and vanilla syrup over ice.",
			price: 4.25,
			category: "iced",
			imageUrl: "/images/icedcoffee.jpg",
		},
		{
			name: "Cold Brew",
			description: "Smooth slow-steeped cold brew served over ice.",
			price: 3.95,
			category: "iced",
			imageUrl: "/images/icedcoffee.jpg",
		},
		{
			name: "Iced Mocha",
			description: "Chocolate and espresso over milk and ice.",
			price: 4.75,
			category: "iced",
			imageUrl: "/images/icedcoffee.jpg",
		},
		{
			name: "Caramel Cloud Cold Brew",
			description:
				"Velvety cold brew topped with caramel foam and a hint of vanilla.",
			price: 5.15,
			category: "iced",
			imageUrl: "/images/caramel-cloud.jpg",
			featured: true,
		},
	];

	for (const drink of drinks) {
		await prisma.drink.upsert({
			where: { name: drink.name },
			update: {
				description: drink.description,
				price: drink.price,
				category: drink.category,
				imageUrl: drink.imageUrl,
			},
			create: drink,
		});
	}

	console.log("🌟 Drinks added or updated.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
