"use client";

import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	Button,
} from "@mui/material";
import { motion } from "framer-motion";

export default function ProductCard({ drink, onCustomize }) {
	return (
		<motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
			<Card sx={{ borderRadius: 3 }}>
				<CardMedia
					component="img"
					height="140"
					image={drink.imageUrl}
					alt={drink.name}
				/>
				<CardContent>
					<Typography variant="h6" fontWeight={600}>
						{drink.name}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{drink.description}
					</Typography>
					<Typography fontWeight={600} sx={{ mt: 1 }}>
						${drink.price.toFixed(2)}
					</Typography>
					<Button
						fullWidth
						variant="outlined"
						sx={{ mt: 2, textTransform: "none", fontWeight: 500 }}
						onClick={() => onCustomize(drink)}
					>
						Customize
					</Button>
				</CardContent>
			</Card>
		</motion.div>
	);
}
