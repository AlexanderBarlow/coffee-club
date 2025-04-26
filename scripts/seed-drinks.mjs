import { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";

const prisma = new PrismaClient();

// Helper to pick random items
function getRandomItems(array, maxItems) {
	const count = randomInt(1, maxItems + 1);
	const shuffled = [...array].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

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

	console.log("✅ Syrups, Sauces, and Milks Seeded");

	// --- Categories ---
	const categories = [
		{ name: "iced", emoji: "❄️" },
		{ name: "hot", emoji: "🔥" },
		{ name: "espresso", emoji: "☕" },
		{ name: "frappes", emoji: "🧋" },
		{ name: "tea", emoji: "🍵" },
		{ name: "grub", emoji: "🥪" },
	];

	const categoryRecords = {};
	for (const cat of categories) {
		const created = await prisma.category.upsert({
			where: { name: cat.name },
			update: {},
			create: cat,
		});
		categoryRecords[cat.name] = created;
	}

	console.log("✅ Categories Seeded");

	// --- Drinks ---
	const drinks = [
		{
			name: "Iced Vanilla Latte",
			desc: "Chilled espresso with milk and vanilla syrup over ice.",
			price: 4.25,
			category: "iced",
			img: "/images/iced-vanilla-latte.png",
			featured: true,
		},
		{
			name: "Cold Brew",
			desc: "Smooth slow-steeped cold brew served over ice.",
			price: 3.95,
			category: "iced",
			img: "/images/cold-brew.png",
		},
		{
			name: "Iced Mocha",
			desc: "Chocolate and espresso over milk and ice.",
			price: 4.75,
			category: "iced",
			img: "/images/iced-coffee.png",
		},
		{
			name: "Iced Caramel Macchiato",
			desc: "Caramel and espresso over milk and ice.",
			price: 4.75,
			category: "iced",
			img: "/images/caramel-macchiato.png",
			featured: true,
		},
		{
			name: "Caramel Cloud Cold Brew",
			desc: "Velvety cold brew topped with caramel foam and vanilla.",
			price: 5.15,
			category: "iced",
			img: "/images/caramel-cloud.png",
			featured: true,
		},
		{
			name: "Classic Hot Coffee",
			desc: "Smooth and bold hot coffee brewed fresh.",
			price: 2.75,
			category: "hot",
			img: "/images/classic-hot.png",
		},
		{
			name: "Caramel Latte",
			desc: "Steamed milk with espresso and caramel syrup.",
			price: 4.5,
			category: "hot",
			img: "/images/caramel-latte.png",
		},
		{
			name: "Cappuccino",
			desc: "Espresso with thick milk foam on top.",
			price: 4.0,
			category: "hot",
			img: "/images/cappucino.png",
		},
		{
			name: "Single Espresso Shot",
			desc: "Intense and rich espresso shot.",
			price: 2.25,
			category: "espresso",
			img: "/images/single-espresso.png",
		},
		{
			name: "Doppio",
			desc: "Double shot of rich espresso.",
			price: 2.95,
			category: "espresso",
			img: "/images/doppio.png",
		},
		{
			name: "Mocha Frappe",
			desc: "Frozen blended coffee with chocolate flavor.",
			price: 4.95,
			category: "frappes",
			img: "/images/mocha-frappe.png",
			featured: true,
		},
		{
			name: "Vanilla Frappe",
			desc: "Frozen frappe blended with vanilla sweetness.",
			price: 4.85,
			category: "frappes",
			img: "/images/vanilla-frappe.png",
		},
		{
			name: "Chai Tea Latte",
			desc: "Black tea infused with spices and steamed milk.",
			price: 3.95,
			category: "tea",
			img: "/images/chai-tea.png",
		},
		{
			name: "Green Tea",
			desc: "Fresh brewed green tea rich in antioxidants.",
			price: 2.5,
			category: "tea",
			img: "/images/green-tea.png",
		},
		{
			name: "Breakfast Sandwich",
			desc: "Egg, cheese and bacon on a warm biscuit.",
			price: 5.25,
			category: "grub",
			img: "/images/breakfast-sandwich.png",
		},
		{
			name: "Blueberry Muffin",
			desc: "Soft muffin filled with juicy blueberries.",
			price: 2.95,
			category: "grub",
			img: "/images/blueberry-muffin.png",
		},
	];

	for (const drink of drinks) {
		const randomSyrups = getRandomItems(syrupRecords, 2);
		const randomSauces = getRandomItems(sauceRecords, 2);

		await prisma.drink.upsert({
			where: { name: drink.name },
			update: {
				description: drink.desc,
				price: drink.price,
				imageUrl: drink.img,
				featured: drink.featured || false,
				categoryId: categoryRecords[drink.category].id,
				customizeOptions: {
					milk: drink.category !== "grub" && drink.category !== "tea",
					syrup:
						drink.category === "iced" ||
						drink.category === "hot" ||
						drink.category === "frappes",
					sauce:
						drink.category === "iced" ||
						drink.category === "hot" ||
						drink.category === "frappes",
					extraShots: drink.category !== "grub" && drink.category !== "tea",
					size: true,
					notes: true,
				},
				syrups: { set: randomSyrups.map((s) => ({ id: s.id })) },
				sauces: { set: randomSauces.map((s) => ({ id: s.id })) },
				milks: { set: milkRecords.map((m) => ({ id: m.id })) },
			},
			create: {
				name: drink.name,
				description: drink.desc,
				price: drink.price,
				imageUrl: drink.img,
				featured: drink.featured || false,
				categoryId: categoryRecords[drink.category].id,
				customizeOptions: {
					milk: drink.category !== "grub" && drink.category !== "tea",
					syrup:
						drink.category === "iced" ||
						drink.category === "hot" ||
						drink.category === "frappes",
					sauce:
						drink.category === "iced" ||
						drink.category === "hot" ||
						drink.category === "frappes",
					extraShots: drink.category !== "grub" && drink.category !== "tea",
					size: true,
					notes: true,
				},
				syrups: { connect: randomSyrups.map((s) => ({ id: s.id })) },
				sauces: { connect: randomSauces.map((s) => ({ id: s.id })) },
				milks: { connect: milkRecords.map((m) => ({ id: m.id })) },
			},
		});
	}

	console.log("✅ Drinks fully seeded into their categories!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
