import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const syrups = [
		{ name: "Vanilla", brand: "Monin", description: "Classic vanilla flavor." },
		{ name: "Caramel", brand: "Torani", description: "Rich buttery caramel." },
		{
			name: "Hazelnut",
			brand: "DaVinci",
			description: "Nutty sweet hazelnut.",
		},
		{
			name: "Pumpkin Spice",
			brand: "Torani",
			description: "Spiced seasonal blend.",
		},
	];

	const sauces = [
		{
			name: "Mocha",
			brand: "Ghirardelli",
			description: "Dark chocolate sauce.",
		},
		{
			name: "White Chocolate",
			brand: "Monin",
			description: "Creamy white chocolate.",
		},
		{
			name: "Caramel Sauce",
			brand: "Torani",
			description: "Thick and golden caramel.",
		},
	];

	const milks = [
		{
			name: "Whole",
			emoji: "🥛",
			brand: "DairyPure",
			description: "Rich whole milk.",
			raw: false,
		},
		{
			name: "Raw",
			emoji: "🧑‍🌾",
			brand: "Local Amish Farms",
			description: "Unpasteurized fresh milk.",
			raw: true,
		},
		{
			name: "Skim",
			emoji: "💧",
			brand: "DairyPure",
			description: "Fat-free skim milk.",
			raw: false,
		},
		{
			name: "Oat",
			emoji: "🌾",
			brand: "Oatly",
			description: "Plant-based oat milk.",
			raw: false,
		},
		{
			name: "Almond",
			emoji: "🌰",
			brand: "Califia Farms",
			description: "Nutty almond milk.",
			raw: false,
		},
		{
			name: "Soy",
			emoji: "🫘",
			brand: "Silk",
			description: "Smooth soy milk.",
			raw: false,
		},
	];

	// Seed Syrups
	const syrupRecords = await Promise.all(
		syrups.map((syrup) =>
			prisma.syrup.upsert({
				where: { name: syrup.name },
				update: {},
				create: syrup,
			})
		)
	);

	// Seed Sauces
	const sauceRecords = await Promise.all(
		sauces.map((sauce) =>
			prisma.sauce.upsert({
				where: { name: sauce.name },
				update: {},
				create: sauce,
			})
		)
	);

	// Seed Milks
	const milkRecords = await Promise.all(
		milks.map((milk) =>
			prisma.milk.upsert({
				where: { name: milk.name },
				update: {},
				create: milk,
			})
		)
	);

	console.log("🧴 Syrups, sauces, and milks seeded.");

	const drinks = [
		{
			name: "Iced Vanilla Latte",
			description: "Chilled espresso with milk and vanilla syrup over ice.",
			price: 4.25,
			category: "iced",
			imageUrl: "/images/iced-vanilla-latte.png",
		},
		{
			name: "Cold Brew",
			description: "Smooth slow-steeped cold brew served over ice.",
			price: 3.95,
			category: "iced",
			imageUrl: "/images/cold-brew.png",
		},
		{
			name: "Iced Mocha",
			description: "Chocolate and espresso over milk and ice.",
			price: 4.75,
			category: "iced",
			imageUrl: "/images/iced-coffee.png",
		},
		{
			name: "Iced Caramel Macchiato",
			description: "Caramel and espresso over milk and ice.",
			price: 4.75,
			category: "iced",
			imageUrl: "/images/caramel-macchiato.png",
			featured: true,
		},
		{
			name: "Caramel Cloud Cold Brew",
			description:
				"Velvety cold brew topped with caramel foam and a hint of vanilla.",
			price: 5.15,
			category: "iced",
			imageUrl: "/images/caramel-cloud.png",
			featured: true,
		},
		{
			name: "Classic Hot Coffee",
			description: "Smooth and bold hot coffee brewed fresh.",
			price: 2.75,
			category: "hot",
			imageUrl: "/images/classic-hot.png",
		},
		{
			name: "Caramel Latte",
			description: "Steamed milk with espresso and caramel syrup.",
			price: 4.5,
			category: "hot",
			imageUrl: "/images/caramel-latte.png",
		},
		{
			name: "Cappuccino",
			description: "Espresso with thick milk foam on top.",
			price: 4.0,
			category: "hot",
			imageUrl: "/images/cappucino.png",
		},
		{
			name: "Single Espresso Shot",
			description: "Intense and rich espresso shot.",
			price: 2.25,
			category: "espresso",
			imageUrl: "/images/single-espresso.png",
		},
		{
			name: "Doppio",
			description: "Double shot of rich espresso.",
			price: 2.95,
			category: "espresso",
			imageUrl: "/images/doppio.png",
		},
		{
			name: "Mocha Frappe",
			description: "Frozen blended coffee with chocolate flavor.",
			price: 4.95,
			category: "frappes",
			imageUrl: "/images/mocha-frappe.png",
			featured: true,
		},
		{
			name: "Vanilla Frappe",
			description: "Frozen frappe blended with vanilla sweetness.",
			price: 4.85,
			category: "frappes",
			imageUrl: "/images/vanilla-frappe.png",
		},
		{
			name: "Chai Tea Latte",
			description: "Black tea infused with spices and steamed milk.",
			price: 3.95,
			category: "tea",
			imageUrl: "/images/chai-tea.png",
		},
		{
			name: "Green Tea",
			description: "Fresh brewed green tea rich in antioxidants.",
			price: 2.5,
			category: "tea",
			imageUrl: "/images/green-tea.png",
		},
		{
			name: "Breakfast Sandwich",
			description: "Egg, cheese and bacon on a warm biscuit.",
			price: 5.25,
			category: "grub",
			imageUrl: "/images/breakfast-sandwich.png",
		},
		{
			name: "Blueberry Muffin",
			description: "Soft muffin filled with juicy blueberries.",
			price: 2.95,
			category: "grub",
			imageUrl: "/images/blueberry-muffin.png",
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
				featured: drink.featured || false,
				syrups: { set: syrupRecords.map((s) => ({ id: s.id })) },
				sauces: { set: sauceRecords.map((s) => ({ id: s.id })) },
				milks: { set: milkRecords.map((m) => ({ id: m.id })) },
			},
			create: {
				...drink,
				syrups: { connect: syrupRecords.map((s) => ({ id: s.id })) },
				sauces: { connect: sauceRecords.map((s) => ({ id: s.id })) },
				milks: { connect: milkRecords.map((m) => ({ id: m.id })) },
			},
		});
	}

	console.log("✅ Drinks, syrups, sauces, and milks seeded!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
