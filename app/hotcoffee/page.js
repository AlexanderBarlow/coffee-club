"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import ProductCard from "@/components/ProductCard";
import BottomTabBar from "@/components/MobileNavbar";

export default function EspressoPage() {
	const [drinks, setDrinks] = useState([]);

	useEffect(() => {
		const fetchDrinks = async () => {
			const res = await fetch("/api/drinks?category=hot");
			const data = await res.json();
			setDrinks(data);
		};

		fetchDrinks();
	}, []);

	const handleCustomize = (drink) => {
		console.log("Customize clicked for:", drink.name);
		// Optional: Trigger modal or drawer here
	};

	return (
		<Box sx={{ px: 2, mt: 4, pb: 10 }}>
			<Typography variant="h5" fontWeight={600} gutterBottom>
				⚡ Espresso
			</Typography>

			<Grid container spacing={2}>
				{drinks.map((drink) => (
					<Grid item xs={12} sm={6} key={drink.name}>
						<ProductCard drink={drink} onCustomize={handleCustomize} />
					</Grid>
				))}
			</Grid>
			<BottomTabBar />
		</Box>
	);
}
