"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Container, Skeleton } from "@mui/material";
import ProductCard from "@/components/ProductCard";
import BottomTabBar from "@/components/MobileNavbar";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function CategoryPage({ category, emoji, label }) {
	const [drinks, setDrinks] = useState([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchDrinks = async () => {
			const res = await fetch(`/api/drinks?category=${category}`);
			const data = await res.json();
			setDrinks(data);
			setLoading(false);
		};
		fetchDrinks();
	}, [category]);

	const handleCustomize = (drink) => {
		router.push(`/customize/${drink.id}`);
	};

	return (
		<Box sx={{ backgroundColor: "#fef8f2", minHeight: "100vh" }}>
			<BottomTabBar />

			<Container maxWidth="md" sx={{ pb: 0 }}>
				<Button
					variant="text"
					onClick={() => router.back()}
					sx={{
						color: "#6f4e37",
						textTransform: "none",
						fontWeight: 500,
						fontSize: "0.95rem",
						pl: 0,
						"&:hover": { textDecoration: "underline" },
					}}
				>
					← Back
				</Button>
			</Container>

			<Container
				maxWidth="md"
				sx={{
					pt: 2,
					pb: { xs: 12, sm: 14 },
					minHeight: "100vh",
					position: "relative",
				}}
			>
				<Typography
					variant="h4"
					fontWeight={700}
					sx={{
						mb: 3,
						textAlign: { xs: "center", sm: "left" },
						color: "#6f4e37",
					}}
				>
					{emoji} {label}
				</Typography>

				<Box
					sx={{
						display: "flex",
						flexWrap: "wrap",
						gap: 3,
						justifyContent: { xs: "center", sm: "flex-start" },
					}}
				>
					{loading
						? [...Array(6)].map((_, idx) => (
								<Box
									key={idx}
									sx={{
										width: {
											xs: "100%",
											sm: "calc(50% - 12px)",
											md: "calc(33.333% - 16px)",
										},
										display: "flex",
									}}
								>
									<Skeleton
										variant="rectangular"
										animation="wave"
										height={280}
										sx={{ borderRadius: 3, width: "100%" }}
									/>
								</Box>
						  ))
						: drinks.map((drink) => (
								<Box
									key={drink.name}
									sx={{
										width: {
											xs: "100%",
											sm: "calc(50% - 12px)",
											md: "calc(33.333% - 16px)",
										},
										display: "flex",
									}}
								>
									<ProductCard drink={drink} onCustomize={handleCustomize} />
								</Box>
						  ))}
				</Box>
			</Container>
		</Box>
	);
}
