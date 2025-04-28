"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Paper,
	CircularProgress,
	Divider,
	Chip,
	Tooltip,
} from "@mui/material";
import FeaturedIcon from "@mui/icons-material/Star";
import NotFeaturedIcon from "@mui/icons-material/StarOutline";

export default function AdminMenuEditPage() {
	const [drinks, setDrinks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDrinks = async () => {
			try {
				const res = await fetch("/api/drinks");
				const data = await res.json();
				setDrinks(data);
			} catch (err) {
				console.error("Failed to fetch drinks:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchDrinks();
	}, []);

	if (loading) {
		return (
			<Box sx={{ textAlign: "center", mt: 10 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
			<Typography
				variant="h4"
				fontWeight={700}
				color="#6f4e37"
				textAlign="center"
				mb={4}
			>
				☕ Menu Items Overview
			</Typography>

			{drinks.length === 0 ? (
				<Typography textAlign="center" color="text.secondary">
					No menu items found.
				</Typography>
			) : (
				drinks.map((drink) => (
					<Paper
						key={drink.id}
						sx={{
							p: 3,
							mb: 4,
							borderRadius: 3,
							background: "#fff",
							boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
						}}
					>
						{/* Drink Name */}
						<Typography
							variant="h6"
							fontWeight={700}
							color="#3e3028"
							sx={{ mb: 1 }}
						>
							{drink.name}
						</Typography>

						{/* Top Info */}
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								flexWrap: "wrap",
							}}
						>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Typography
									variant="body2"
									sx={{ color: "text.secondary", fontSize: "0.9rem" }}
								>
									Category:
								</Typography>
								<Chip
									label={drink.category?.name || "Uncategorized"}
									size="small"
									sx={{
										backgroundColor: "#fdf3e7",
										color: "#6f4e37",
										fontWeight: 600,
									}}
								/>
							</Box>

							<Box sx={{ textAlign: "right", mt: { xs: 2, sm: 0 } }}>
								<Typography
									variant="subtitle1"
									fontWeight={700}
									color="#6f4e37"
									sx={{ mb: 1 }}
								>
									${drink.price?.toFixed(2)}
								</Typography>

								<Tooltip
									title={drink.featured ? "Featured Drink" : "Not Featured"}
								>
									{drink.featured ? (
										<FeaturedIcon sx={{ color: "#f9a825" }} />
									) : (
										<NotFeaturedIcon sx={{ color: "#ccc" }} />
									)}
								</Tooltip>
							</Box>
						</Box>

						<Divider sx={{ my: 2 }} />

						{/* Customization Info */}
						<Box sx={{ mt: 2 }}>
							<Typography fontWeight={600} mb={1}>
								Customizations:
							</Typography>

							{drink.syrups?.length > 0 ||
							drink.sauces?.length > 0 ||
							drink.milks?.length > 0 ? (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
									{drink.syrups?.length > 0 && (
										<Chip
											label={`Syrups: ${drink.syrups.length}`}
											variant="outlined"
											color="primary"
										/>
									)}
									{drink.sauces?.length > 0 && (
										<Chip
											label={`Sauces: ${drink.sauces.length}`}
											variant="outlined"
											color="secondary"
										/>
									)}
									{drink.milks?.length > 0 && (
										<Chip
											label={`Milks: ${drink.milks.length}`}
											variant="outlined"
											sx={{
												backgroundColor: "#f0f0f0",
												color: "#3e3028",
											}}
										/>
									)}
								</Box>
							) : (
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ mt: 1 }}
								>
									No customization options available.
								</Typography>
							)}
						</Box>
					</Paper>
				))
			)}
		</Box>
	);
}
