"use client";

import { useRouter } from "next/navigation";
import {
	Box,
	Typography,
	Grid,
	Card,
	CardContent,
	useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import BottomTabBar from "@/components/MobileNavbar";

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
	const theme = useTheme();

	return (
		<Box sx={{ px: 2, mt: 4, pb: 12 }}>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Typography
					variant="h4"
					fontWeight={700}
					sx={{
						textAlign: "center",
						mb: 1,
						color: theme.palette.primary.main,
						letterSpacing: 1,
					}}
				>
					Coffee Club Menu ☕
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ textAlign: "center", mb: 4 }}
				>
					Choose your craving and dive into our crafted selections.
				</Typography>
			</motion.div>

			<Grid container spacing={3}>
				{menuCategories.map((category, i) => (
					<Grid item xs={6} sm={4} key={category.title}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.1, duration: 0.4 }}
							whileHover={{ scale: 1.06 }}
							whileTap={{ scale: 0.95 }}
						>
							<Card
								onClick={() => router.push(category.link)}
								sx={{
									borderRadius: 4,
									p: 2,
									textAlign: "center",
									cursor: "pointer",
									boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
									background: "#fff",
									transition: "all 0.3s ease",
									"&:hover": {
										boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
										background: "#f9f9f9",
									},
								}}
							>
								<CardContent>
									<Typography fontSize={36}>{category.emoji}</Typography>
									<Typography
										variant="subtitle1"
										fontWeight={600}
										sx={{ mt: 1 }}
									>
										{category.title}
									</Typography>
								</CardContent>
							</Card>
						</motion.div>
						<BottomTabBar />
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
