"use client";

import {
	Card,
	CardMedia,
	CardContent,
	Typography,
	Button,
	Box,
} from "@mui/material";
import { motion } from "framer-motion";

export default function ProductCard({ drink, onCustomize }) {
	return (
		<motion.div
			whileHover={{ scale: 1.02, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" }}
			transition={{ type: "spring", stiffness: 200, damping: 20 }}
			style={{ width: "100%" }}
		>
			<Card
				elevation={3}
				sx={{
					borderRadius: 5,
					overflow: "hidden",
					display: "flex",
					flexDirection: "column",
					height: "100%",
					backgroundColor: "#fffdfb",
				}}
			>
				<CardMedia
					component="img"
					height="180"
					image={drink.imageUrl}
					alt={drink.name}
					sx={{
						objectFit: "cover",
						transition: "transform 0.4s ease",
						"&:hover": {
							transform: "scale(1.05)",
						},
					}}
				/>

				<CardContent
					sx={{
						flexGrow: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						p: 2,
					}}
				>
					<Box>
						<Typography variant="h6" fontWeight={700} color="#3e3028">
							{drink.name}
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
							{drink.description}
						</Typography>
					</Box>

					<Box
						mt={2}
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography fontWeight={600} fontSize="1rem" color="#6f4e37">
							${drink.price.toFixed(2)}
						</Typography>
						<Button
							onClick={() => onCustomize(drink)}
							size="small"
							variant="outlined"
							sx={{
								textTransform: "none",
								borderRadius: 3,
								fontWeight: 500,
								borderColor: "#6f4e37",
								color: "#6f4e37",
								"&:hover": {
									backgroundColor: "#6f4e3711",
								},
							}}
						>
							Customize
						</Button>
					</Box>
				</CardContent>
			</Card>
		</motion.div>
	);
}
