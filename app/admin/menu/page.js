"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Paper,
	IconButton,
	Button,
	Grid,
	Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

export default function AdminMenuPage() {
	const [drinks, setDrinks] = useState([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchDrinks = async () => {
			try {
				const res = await fetch("/api/drinks");
				const data = await res.json();

				// ✅ Ensure it's an array
				if (Array.isArray(data)) {
					setDrinks(data);
				} else {
					console.error("Expected array but got:", data);
					setDrinks([]); // prevent crash
				}
			} catch (err) {
				console.error("Failed to fetch drinks:", err);
				setDrinks([]);
			} finally {
				setLoading(false);
			}
		};
		fetchDrinks();
	}, []);



	const toggleAvailability = async (id, available) => {
		try {
			const res = await fetch(`/api/drinks/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ available: !available }),
			});

			if (res.ok) {
				const updated = await res.json();
				setDrinks((prev) =>
					prev.map((d) =>
						d.id === id ? { ...d, available: updated.available } : d
					)
				);
			}
		} catch (error) {
			console.error("Error toggling availability:", error);
		}
	};

	return (
		<Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 4 }}>
			<Typography variant="h4" fontWeight={600} gutterBottom>
				Admin: Menu Management
			</Typography>

			<Button
				variant="contained"
				startIcon={<AddIcon />}
				sx={{ mb: 3 }}
				onClick={() => router.push("/admin/menu/adddrink")}
			>
				Add New Drink
			</Button>

			{loading ? (
				<Typography>Loading drinks...</Typography>
			) : drinks.length === 0 ? (
				<Typography>No drinks available.</Typography>
			) : (
				<Grid container spacing={2}>
					{drinks.map((drink) => (
						<Grid item xs={12} md={6} key={drink.id}>
							<Paper
								sx={{
									p: 2,
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Box>
									<Typography fontWeight={600}>{drink.name}</Typography>
									<Typography variant="body2" color="text.secondary">
										{drink.category} — ${drink.price.toFixed(2)}
									</Typography>
								</Box>
								<Box display="flex" alignItems="center" gap={1}>
									<Switch
										checked={drink.available}
										onChange={() =>
											toggleAvailability(drink.id, drink.available)
										}
										color="primary"
									/>
									<IconButton
										onClick={() => router.push(`/admin/menu/edit/${drink.id}`)}
									>
										<EditIcon />
									</IconButton>
								</Box>
							</Paper>
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
}
