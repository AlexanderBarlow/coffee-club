"use client";

import { useRouter } from "next/navigation";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";

const menuCategories = [
	{ title: "Iced Coffees", emoji: "🧊", link: "/icedcoffee" },
	{ title: "Hot Coffees", emoji: "☕", link: "/hotcoffee" },
	{ title: "Espresso", emoji: "⚡", link: "/espresso" },
	{ title: "Frappes", emoji: "🍧", link: "/frappes" },
	{ title: "Tea", emoji: "🍵", link: "/tea" },
	{ title: "Grub", emoji: "🍽️", link: "/grub" },
];

export default function MenuPage() {
	const router = useRouter();

	return (
		<Box sx={{ px: 2, mt: 4, pb: 10 }}>
			<Typography variant="h5" fontWeight={600} gutterBottom>
				Explore the Menu
			</Typography>

			<Grid container spacing={2}>
				{menuCategories.map((category) => (
					<Grid item xs={6} sm={4} key={category.title}>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
							<Card
								sx={{
									textAlign: "center",
									borderRadius: 3,
									p: 2,
									cursor: "pointer",
									minHeight: 100,
								}}
								elevation={2}
								onClick={() => router.push(category.link)}
							>
								<CardContent>
									<Typography fontSize={30}>{category.emoji}</Typography>
									<Typography fontWeight={500}>{category.title}</Typography>
								</CardContent>
							</Card>
						</motion.div>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
