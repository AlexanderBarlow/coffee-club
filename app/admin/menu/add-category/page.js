"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Paper,
	Button,
	TextField,
	IconButton,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);
	const [formState, setFormState] = useState({ name: "", emoji: "" });
	const [editId, setEditId] = useState(null);
	const router = useRouter();

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			const res = await fetch("/api/admin/categories");
			const data = await res.json();
			setCategories(data);
		} catch (err) {
			console.error("Failed to load categories:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		if (!formState.name.trim()) return;

		try {
			if (editId) {
				// Update existing category
				await fetch(`/api/admin/categories/${editId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formState),
				});
			} else {
				// Create new category
				await fetch("/api/admin/categories", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formState),
				});
			}

			setOpenDialog(false);
			setFormState({ name: "", emoji: "" });
			setEditId(null);
			fetchCategories();
		} catch (err) {
			console.error("Failed to save category:", err);
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this category?")) return;
		try {
			await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
			fetchCategories();
		} catch (err) {
			console.error("Failed to delete category:", err);
		}
	};

	return (
		<Box>
			<Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
				📂 Manage Categories
			</Typography>

			<Button
				variant="contained"
				onClick={() => {
					setEditId(null);
					setFormState({ name: "", emoji: "" });
					setOpenDialog(true);
				}}
				sx={{ mb: 3, borderRadius: 99 }}
			>
				➕ Add New Category
			</Button>

			{loading ? (
				<CircularProgress />
			) : (
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
					{categories.map((cat) => (
						<Paper
							key={cat.id}
							elevation={3}
							sx={{
								p: 3,
								minWidth: 240,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 1,
								position: "relative",
							}}
						>
							<Typography variant="h3" component="span">
								{cat.emoji || "📦"}
							</Typography>
							<Typography variant="h6" fontWeight={600}>
								{cat.name}
							</Typography>

							<Box sx={{ display: "flex", gap: 1, mt: 1 }}>
								<IconButton
									onClick={() => {
										setEditId(cat.id);
										setFormState({ name: cat.name, emoji: cat.emoji || "" });
										setOpenDialog(true);
									}}
									size="small"
								>
									<Edit fontSize="small" />
								</IconButton>
								<IconButton
									onClick={() => handleDelete(cat.id)}
									size="small"
									color="error"
								>
									<Delete fontSize="small" />
								</IconButton>
							</Box>
						</Paper>
					))}
				</Box>
			)}

			{/* Add/Edit Dialog */}
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>{editId ? "Edit Category" : "Add Category"}</DialogTitle>
				<DialogContent
					sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
				>
					<TextField
						label="Category Name"
						value={formState.name}
						onChange={(e) =>
							setFormState({ ...formState, name: e.target.value })
						}
						fullWidth
					/>
					<TextField
						label="Emoji (Optional)"
						value={formState.emoji}
						onChange={(e) =>
							setFormState({ ...formState, emoji: e.target.value })
						}
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancel</Button>
					<Button onClick={handleSave} variant="contained">
						{editId ? "Update" : "Create"}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
