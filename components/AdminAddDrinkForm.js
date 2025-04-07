"use client";

import {
	TextField,
	Box,
	Button,
	FormControlLabel,
	Switch,
	MenuItem,
	Typography,
	Paper,
} from "@mui/material";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const categories = ["iced", "hot", "espresso", "frappes", "tea", "grub"];

export default function AdminAddDrinkForm({ onDrinkAdded }) {
	const [form, setForm] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		imageUrl: "",
		file: null,
		available: true,
		featured: false,
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleToggle = (e) => {
		const { name, checked } = e.target;
		setForm((prev) => ({ ...prev, [name]: checked }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setForm((prev) => ({ ...prev, file }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		let imageUrl = "";

		// Upload image to Supabase if file exists
		if (form.file) {
			const fileExt = form.file.name.split(".").pop();
			const fileName = `${Date.now()}.${fileExt}`;
			const filePath = `${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from("drink-images")
				.upload(filePath, form.file);

			if (uploadError) {
				setError("Image upload failed");
				setLoading(false);
				return;
			}

			const { data: publicUrlData } = supabase.storage
				.from("drink-images")
				.getPublicUrl(filePath);

			imageUrl = publicUrlData?.publicUrl || "";
		}

		const res = await fetch("/api/drinks/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: form.name,
				description: form.description,
				price: parseFloat(form.price),
				category: form.category,
				imageUrl,
				available: form.available,
				featured: form.featured,
			}),
		});

		if (!res.ok) {
			const { error } = await res.json();
			setError(error || "Something went wrong");
		} else {
			const newDrink = await res.json();
			onDrinkAdded?.(newDrink);
			setForm({
				name: "",
				description: "",
				price: "",
				category: "",
				imageUrl: "",
				file: null,
				available: true,
				featured: false,
			});
		}

		setLoading(false);
	};

	return (
		<Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
			<Typography variant="h6" fontWeight={600} gutterBottom>
				Add New Drink
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					fullWidth
					name="name"
					label="Name"
					required
					value={form.name}
					onChange={handleChange}
					margin="normal"
				/>
				<TextField
					fullWidth
					name="description"
					label="Description"
					required
					value={form.description}
					onChange={handleChange}
					margin="normal"
				/>
				<TextField
					fullWidth
					name="price"
					label="Price"
					type="number"
					required
					value={form.price}
					onChange={handleChange}
					margin="normal"
				/>
				<TextField
					fullWidth
					name="category"
					label="Category"
					select
					required
					value={form.category}
					onChange={handleChange}
					margin="normal"
				>
					{categories.map((cat) => (
						<MenuItem key={cat} value={cat}>
							{cat}
						</MenuItem>
					))}
				</TextField>

				<Box sx={{ mt: 2 }}>
					<Typography variant="body2" sx={{ mb: 1 }}>
						Upload Image
					</Typography>
					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						style={{ display: "block", marginBottom: "1rem" }}
					/>
				</Box>

				<FormControlLabel
					control={
						<Switch
							checked={form.available}
							onChange={handleToggle}
							name="available"
						/>
					}
					label="Available"
				/>
				<FormControlLabel
					control={
						<Switch
							checked={form.featured}
							onChange={handleToggle}
							name="featured"
						/>
					}
					label="Featured"
				/>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
					disabled={loading}
					sx={{ mt: 2 }}
				>
					{loading ? "Adding..." : "Add Drink"}
				</Button>

				{error && (
					<Typography color="error" variant="body2" sx={{ mt: 1 }}>
						{error}
					</Typography>
				)}
			</form>
		</Paper>
	);
}
