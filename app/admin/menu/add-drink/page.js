"use client";

import { useState, useEffect } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Switch,
	FormControlLabel,
	Paper,
	CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function AddDrinkPage() {
	const [categories, setCategories] = useState([]);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		categoryId: "",
		imageUrl: "",
		available: true,
		featured: false,
	});
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await fetch("/api/admin/categories");
				const data = await res.json();
				setCategories(data);
			} catch (err) {
				console.error("Failed to fetch categories:", err);
			}
		};
		fetchCategories();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await fetch("/api/admin/drinks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					price: parseFloat(formData.price),
				}),
			});

			if (res.ok) {
				router.push("/admin/menu"); // ✅ after success
			} else {
				const error = await res.text();
				console.error("Error:", error);
			}
		} catch (err) {
			console.error("Error submitting drink:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
			<Typography variant="h4" fontWeight={700} mb={3}>
				➕ Add New Drink
			</Typography>

			<Paper sx={{ p: 3 }}>
				<form onSubmit={handleSubmit}>
					<TextField
						label="Drink Name"
						fullWidth
						required
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						sx={{ mb: 2 }}
					/>

					<TextField
						label="Description"
						fullWidth
						multiline
						rows={3}
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
						sx={{ mb: 2 }}
					/>

					<TextField
						label="Price"
						fullWidth
						type="number"
						required
						value={formData.price}
						onChange={(e) =>
							setFormData({ ...formData, price: e.target.value })
						}
						sx={{ mb: 2 }}
					/>

					<FormControl fullWidth sx={{ mb: 2 }}>
						<InputLabel>Category</InputLabel>
						<Select
							required
							value={formData.categoryId}
							onChange={(e) =>
								setFormData({ ...formData, categoryId: e.target.value })
							}
							label="Category"
						>
							{categories.map((cat) => (
								<MenuItem key={cat.id} value={cat.id}>
									{cat.emoji} {cat.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						label="Image URL"
						fullWidth
						value={formData.imageUrl}
						onChange={(e) =>
							setFormData({ ...formData, imageUrl: e.target.value })
						}
						sx={{ mb: 2 }}
					/>

					<FormControlLabel
						control={
							<Switch
								checked={formData.available}
								onChange={(e) =>
									setFormData({ ...formData, available: e.target.checked })
								}
							/>
						}
						label="Available"
						sx={{ mb: 1 }}
					/>

					<FormControlLabel
						control={
							<Switch
								checked={formData.featured}
								onChange={(e) =>
									setFormData({ ...formData, featured: e.target.checked })
								}
							/>
						}
						label="Featured"
						sx={{ mb: 2 }}
					/>

					<Button
						type="submit"
						variant="contained"
						fullWidth
						sx={{ py: 1.5, mt: 1 }}
						disabled={loading}
					>
						{loading ? <CircularProgress size={24} /> : "Add Drink"}
					</Button>
				</form>
			</Paper>
		</Box>
	);
}
