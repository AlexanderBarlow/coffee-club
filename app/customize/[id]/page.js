"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	Box,
	Typography,
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Divider,
	Paper,
	ToggleButtonGroup,
	ToggleButton,
	useMediaQuery,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function CustomizePage() {
	const { id } = useParams();
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width:600px)");

	const [drink, setDrink] = useState(null);
	const [loading, setLoading] = useState(true);
	const [customization, setCustomization] = useState({
		milk: "Whole",
		syrup: "",
		sauce: "",
		extraShots: 0,
		size: "M",
		notes: "",
	});

	const [syrups, setSyrups] = useState([]);
	const [sauces, setSauces] = useState([]);
	const [milks, setMilks] = useState([]);

	useEffect(() => {
		const checkAuthAndFetch = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				router.push("/login");
				return;
			}

			try {
				const [drinkRes, optionsRes] = await Promise.all([
					fetch(`/api/drinks/${id}`),
					fetch("/api/options"),
				]);

				const drinkData = await drinkRes.json();
				const optionsData = await optionsRes.json();

				setDrink(drinkData);
				setSyrups(optionsData.syrups || []);
				setSauces(optionsData.sauces || []);
				setMilks(optionsData.milks || []);
			} catch (err) {
				console.error("Error fetching data:", err);
			} finally {
				setLoading(false);
			}
		};

		checkAuthAndFetch();
	}, [id, router]);

	const handleAddToCart = () => {
		const cart = JSON.parse(localStorage.getItem("cart") || "[]");
		cart.push({ ...drink, customization });
		localStorage.setItem("cart", JSON.stringify(cart));
		router.push("/cart");
	};

	if (loading) return <CircularProgress sx={{ mt: 5 }} />;

	if (!drink) {
		return (
			<Typography variant="h6" color="error" sx={{ mt: 4 }}>
				Drink not found.
			</Typography>
		);
	}

	return (
		<Box
			sx={{ px: 2, py: 4, maxWidth: 800, mx: "auto", background: "#fef8f2" }}
		>
			<Button
				variant="text"
				onClick={() => router.back()}
				sx={{
					mb: 2,
					color: "#6f4e37",
					textTransform: "none",
					fontWeight: 500,
					fontSize: "0.95rem",
					"&:hover": { textDecoration: "underline" },
				}}
			>
				← Back
			</Button>
			<Paper elevation={3} sx={{ p: 3, background: "#fef8f2" }}>
				{/* Image & Title */}
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						gap: 3,
						mb: 3,
					}}
				>
					<Box sx={{ flex: 1 }}>
						<Typography
							variant="h4"
							fontWeight={700}
							gutterBottom
							sx={{ color: "#6f4e37" }}
						>
							{drink.name}
						</Typography>
						<Typography variant="body1" color="text.secondary">
							{drink.description}
						</Typography>
					</Box>
					<Box
						sx={{
							position: "relative",
							width: { xs: "100%", sm: 200 },
							height: { xs: 180, sm: 200 },
							borderRadius: 3,
							overflow: "hidden",
							flexShrink: 0,
							mx: { xs: "auto", sm: 0 },
						}}
					>
						<Image
							src={drink.imageUrl || "/images/fallback.jpg"}
							alt={drink.name}
							fill
							style={{ objectFit: "cover" }}
						/>
					</Box>
				</Box>

				{/* Size */}
				<Typography gutterBottom fontWeight={600}>
					Choose Your Size
				</Typography>
				<ToggleButtonGroup
					exclusive
					value={customization.size}
					onChange={(e, value) =>
						value && setCustomization((prev) => ({ ...prev, size: value }))
					}
					sx={{ mb: 3 }}
				>
					{["S", "M", "L"].map((size) => (
						<ToggleButton
							key={size}
							value={size}
							sx={{ borderRadius: "999px", textTransform: "none", px: 3 }}
						>
							{size}
						</ToggleButton>
					))}
				</ToggleButtonGroup>

				{/* Milk */}
				<Typography gutterBottom fontWeight={600}>
					Choose Your Milk
				</Typography>
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
					{milks.map((milk) => (
						<ToggleButton
							key={milk.name}
							value={milk.name}
							selected={customization.milk === milk.name}
							onClick={() =>
								setCustomization((prev) => ({ ...prev, milk: milk.name }))
							}
							sx={{
								borderRadius: "999px",
								textTransform: "none",
								px: 2,
								py: 1,
								fontWeight: 600,
								fontSize: "0.85rem",
								borderColor: "#ccc",
								"&.Mui-selected": { backgroundColor: "#6f4e37", color: "#fff" },
							}}
						>
							{milk.emoji || "🥛"} {milk.name}
						</ToggleButton>
					))}
				</Box>

				{/* Syrup */}
				<FormControl fullWidth sx={{ mb: 3 }}>
					<InputLabel>Syrup</InputLabel>
					<Select
						value={customization.syrup}
						label="Syrup"
						onChange={(e) =>
							setCustomization((prev) => ({ ...prev, syrup: e.target.value }))
						}
					>
						<MenuItem value="">None</MenuItem>
						{syrups.map((s) => (
							<MenuItem key={s.id} value={s.name}>
								{s.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Sauce */}
				<FormControl fullWidth sx={{ mb: 3 }}>
					<InputLabel>Sauce</InputLabel>
					<Select
						value={customization.sauce}
						label="Sauce"
						onChange={(e) =>
							setCustomization((prev) => ({ ...prev, sauce: e.target.value }))
						}
					>
						<MenuItem value="">None</MenuItem>
						{sauces.map((s) => (
							<MenuItem key={s.id} value={s.name}>
								{s.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Extra Shots */}
				<FormControl fullWidth sx={{ mb: 3 }}>
					<InputLabel>Extra Shots</InputLabel>
					<Select
						value={customization.extraShots}
						label="Extra Shots"
						onChange={(e) =>
							setCustomization((prev) => ({
								...prev,
								extraShots: e.target.value,
							}))
						}
					>
						{[0, 1, 2, 3].map((shot) => (
							<MenuItem key={shot} value={shot}>
								{shot} shot{shot !== 1 && "s"}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Notes */}
				<TextField
					label="Special Instructions"
					multiline
					fullWidth
					rows={3}
					value={customization.notes}
					onChange={(e) =>
						setCustomization((prev) => ({ ...prev, notes: e.target.value }))
					}
					sx={{ mb: 3 }}
				/>

				<Divider sx={{ my: 2 }} />

				<Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
					Total: ${drink.price.toFixed(2)}
				</Typography>

				<Button
					variant="contained"
					fullWidth
					sx={{
						mt: 1,
						py: 1.5,
						borderRadius: 2,
						backgroundColor: "#6f4e37",
						fontWeight: 600,
						fontSize: "1rem",
						"&:hover": { backgroundColor: "#5c3e2e" },
					}}
					onClick={handleAddToCart}
				>
					Add to Cart
				</Button>
			</Paper>
		</Box>
	);
}
