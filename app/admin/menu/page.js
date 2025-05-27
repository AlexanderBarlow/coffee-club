// app/admin/menu/page.jsx
"use client";

import { useRouter } from "next/navigation";
import {
	Box,
	Typography,
	Grid,
	Card,
	CardActionArea,
	CardContent,
	useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import { motion } from "framer-motion";

const cards = [
	{
		title: "Edit Menu",
		description: "Update existing drinks & pricing",
		icon: <EditIcon fontSize="large" />,
		route: "/admin/menu/edit",
		color: ["#FFEBCD", "#FDDCBF"],
	},
	{
		title: "Add New Item",
		description: "Introduce a brand-new beverage",
		icon: <AddIcon fontSize="large" />,
		route: "/admin/menu/add-drink",
		color: ["#E0F7FA", "#B2EBF2"],
	},
	{
		title: "Categories",
		description: "Organize drinks by category",
		icon: <CategoryIcon fontSize="large" />,
		route: "/admin/menu/add-category",
		color: ["#F3E5F5", "#E1BEE7"],
	},
];

export default function AdminMenuLanding() {
	const router = useRouter();
	const theme = useTheme();

	return (
		<Box sx={{ textAlign: "center", py: { xs: 6, md: 12 }, px: 2 }}>
			<Typography
				variant="h3"
				fontWeight={700}
				gutterBottom
				sx={{
					background: "linear-gradient(90deg, #6F4E37, #C19A6B)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
				}}
			>
				Menu Management
			</Typography>
			<Typography
				variant="subtitle1"
				color="text.secondary"
				sx={{ mb: { xs: 4, md: 8 }, maxWidth: 600, mx: "auto" }}
			>
				Welcome to the heart of your café! Easily edit your menu, add
				delicious new drinks, or curate your categories right from here.
			</Typography>

			<Grid
				container
				spacing={4}
				justifyContent="center"
				sx={{ maxWidth: 900, mx: "auto" }}
			>
				{cards.map((c) => (
					<Grid item xs={12} sm={6} md={4} key={c.title}>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.97 }}
						>
							<Card
								onClick={() => router.push(c.route)}
								sx={{
									height: "100%",
									background: `linear-gradient(135deg, ${c.color[0]} 0%, ${c.color[1]} 100%)`,
									boxShadow: theme.shadows[4],
									borderRadius: 3,
								}}
							>
								<CardActionArea sx={{ height: "100%", p: 3 }}>
									<CardContent
										sx={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											height: "100%",
										}}
									>
										<Box
											sx={{
												mb: 2,
												color: theme.palette.primary.dark,
											}}
										>
											{c.icon}
										</Box>
										<Typography variant="h6" fontWeight={600} gutterBottom>
											{c.title}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											align="center"
										>
											{c.description}
										</Typography>
									</CardContent>
								</CardActionArea>
							</Card>
						</motion.div>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
