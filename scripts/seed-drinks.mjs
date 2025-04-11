import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const drinks = [
    // 🧊 Iced Coffees
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

    // ☕ Hot Coffees
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

    // ⚡ Espresso
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

    // 🍧 Frappes
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

    // 🍵 Tea
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

    // 🍽️ Grub
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
