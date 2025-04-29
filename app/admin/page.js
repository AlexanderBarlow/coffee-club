"use client";

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminHomePage() {
	const router = useRouter();

	return (
		<Box sx={{ textAlign: "center", mt: 10 }}>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<Typography variant="h3" fontWeight={700} color="#6f4e37" mb={3}>
					Welcome, Admin ☕
				</Typography>

				<Typography variant="h6" color="text.secondary" mb={5}>
					Manage orders, customize the menu, and keep Coffee Club running
					smoothly.
				</Typography>

				<Box
					sx={{
						display: "flex",
						gap: 3,
						justifyContent: "center",
						flexWrap: "wrap",
					}}
				>
					<Button
						variant="contained"
						onClick={() => router.push("/admin/orders")}
						sx={{
							backgroundColor: "#6f4e37",
							px: 4,
							py: 1.5,
							borderRadius: 99,
							fontWeight: 600,
							"&:hover": { backgroundColor: "#5c3e2e" },
						}}
					>
						View Orders
					</Button>

					<Button
						variant="outlined"
						onClick={() => router.push("/admin/menu")}
						sx={{
							borderColor: "#6f4e37",
							color: "#6f4e37",
							px: 4,
							py: 1.5,
							borderRadius: 99,
							fontWeight: 600,
							"&:hover": { borderColor: "#5c3e2e", color: "#5c3e2e" },
						}}
					>
						Manage Menu
					</Button>
				</Box>
			</motion.div>
		</Box>
	);
}
