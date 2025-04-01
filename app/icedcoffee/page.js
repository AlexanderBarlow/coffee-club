"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import BottomTabBar from "@/components/MobileNavbar";

export default function IcedCoffeePage() {
  const [drinks, setDrinks] = useState([]);
  const router = useRouter();

  useEffect(() => {
   const fetchDrinks = async () => {
     const res = await fetch("/api/drinks?category=iced");
     const data = await res.json();
     console.log("Fetched drinks:", data); // 👈
     setDrinks(Array.isArray(data) ? data : []); // 👈 safety fallback
   };


    fetchDrinks();
  }, []);

  return (
		<Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: 2, paddingBottom: 10 }}>
			<Typography variant="h5" fontWeight={600} gutterBottom>
				🧊 Iced Coffees
			</Typography>
			<Grid container spacing={3}>
				{drinks.map((drink) => (
					<Grid item xs={12} sm={6} md={4} key={drink.id}>
						<motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
							<Card
								sx={{ borderRadius: 3, cursor: "pointer", }}
								onClick={() => router.push(`/drink/${drink.id}`)}
							>
								{drink.imageUrl && (
									<CardMedia
										component="img"
										image={drink.imageUrl}
										alt={drink.name}
										sx={{
											height: 400,
											objectFit: "cover", // or "contain"
										}}
									/>
								)}
								<CardContent>
									<Typography fontWeight={600}>{drink.name}</Typography>
									<Typography variant="body2" color="text.secondary">
										{drink.description}
									</Typography>
									<Typography fontWeight={500} sx={{ mt: 1 }}>
										${drink.price.toFixed(2)}
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
