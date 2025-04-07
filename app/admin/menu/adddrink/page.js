"use client";

import { Box, Typography, Paper } from "@mui/material";
import AdminAddDrinkForm from "@/components/AdminAddDrinkForm";
import { motion } from "framer-motion";

export default function AddDrinkPage() {
	return (
		<Box sx={{ maxWidth: 600, mx: "auto", mt: 6, px: 2 }}>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<Paper
					elevation={6}
					sx={{
						p: 4,
						borderRadius: 4,
						background: "#fff",
						boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
					}}
				>
					<Typography variant="h5" fontWeight={600} gutterBottom>
						Admin 
					</Typography>

					<AdminAddDrinkForm
						onDrinkAdded={(newDrink) => {
							// Optional: Show a toast, redirect, or reset form
							console.log("New drink added:", newDrink);
						}}
					/>
				</Paper>
			</motion.div>
		</Box>
	);
}
