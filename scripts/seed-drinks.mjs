// scripts/seed-drinks.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const drinks = [
    {
      name: "Iced Vanilla Latte",
      description: "Chilled espresso with milk and vanilla syrup over ice.",
      price: 4.25,
      category: "iced",
      imageUrl: "/images/iced-vanilla-latte.jpg",
    },
    {
      name: "Cold Brew",
      description: "Smooth slow-steeped cold brew served over ice.",
      price: 3.95,
      category: "iced",
      imageUrl: "/images/cold-brew.jpg",
    },
    {
      name: "Iced Mocha",
      description: "Chocolate and espresso over milk and ice.",
      price: 4.75,
      category: "iced",
      imageUrl: "/images/iced-mocha.jpg",
    },
  ];

  for (const drink of drinks) {
    await prisma.drink.upsert({
      where: { name: drink.name },
      update: {},
      create: drink,
    });
  }

  console.log("🌟 Seeded iced drinks.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
