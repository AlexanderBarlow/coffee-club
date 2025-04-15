"use client";

import { useCart } from "@/context/CartContext";
import {
	Box,
	Typography,
	Paper,
	Button,
	Divider,
	IconButton,
	CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ResponsiveNavbar from "@/components/MobileNavbar";

export default function CartPage() {
	const { cart = [], isLoaded, removeFromCart } = useCart();
	const router = useRouter();

	if (!isLoaded) {
		return (
			<Box sx={{ mt: 10, textAlign: "center" }}>
				<CircularProgress />
			</Box>
		);
	}

	const subtotal = cart.reduce((acc, item) => acc + (item?.price || 0), 0);

	return (
		<Box
			sx={{
				px: 2,
				py: 4,
				maxWidth: 800,
				mx: "auto",
				minHeight: "100vh",
				backgroundColor: "#fff",
			}}
		>
			<ResponsiveNavbar />
			<Typography
				variant="h4"
				fontWeight={700}
				sx={{ mb: 3, color: "#6f4e37", pt: 5 }}
			>
				🛒 Your Cart
			</Typography>

			{cart.length === 0 ? (
				<Typography>Your cart is empty.</Typography>
			) : (
				<>
					{cart.map((item, index) => (
						<Paper
							key={index}
							sx={{
								display: "flex",
								gap: 2,
								alignItems: "flex-start",
								mb: 3,
								p: 2,
								borderRadius: 3,
								backgroundColor: "#fef8f2",
								boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
							}}
						>
							<Box
								sx={{
									width: 100,
									height: 100,
									position: "relative",
									borderRadius: 2,
									overflow: "hidden",
									flexShrink: 0,
								}}
							>
								<Image
									src={item.imageUrl || "/images/fallback.jpg"}
									alt={item.name}
									fill
									style={{ objectFit: "cover" }}
								/>
							</Box>

							<Box flex={1}>
								<Typography fontWeight={600} sx={{ color: "#3e3028" }}>
									{item.name || "Unnamed Drink"}
								</Typography>
								<Typography variant="body2">
									Size: {item.customization?.size || "N/A"} | Milk:{" "}
									{item.customization?.milk || "N/A"}
								</Typography>
								<Typography variant="body2">
									Syrup: {item.customization?.syrup || "None"} | Sauce:{" "}
									{item.customization?.sauce || "None"}
								</Typography>
								<Typography variant="body2">
									Shots: {item.customization?.extraShots || 0}
								</Typography>
								{item.customization?.notes && (
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ fontStyle: "italic", mt: 0.5 }}
									>
										“{item.customization.notes}”
									</Typography>
								)}
								<Typography
									variant="subtitle1"
									fontWeight={700}
									sx={{ mt: 1, color: "#6f4e37" }}
								>
									${item.price?.toFixed(2) || "0.00"}
								</Typography>
							</Box>

							<IconButton onClick={() => removeFromCart(index)}>
								<Delete />
							</IconButton>
						</Paper>
					))}

					<Divider sx={{ my: 2 }} />
					<Typography
						variant="h6"
						fontWeight={700}
						sx={{ textAlign: "right", color: "#3e3028" }}
					>
						Subtotal: ${subtotal.toFixed(2)}
					</Typography>
					<Button
						variant="contained"
						fullWidth
						sx={{
							mt: 3,
							py: 1.5,
							borderRadius: 3,
							backgroundColor: "#6f4e37",
							fontWeight: 600,
							fontSize: "1rem",
							"&:hover": {
								backgroundColor: "#5c3e2e",
							},
						}}
						onClick={() => router.push("/checkout")}
					>
						Checkout
					</Button>
				</>
			)}
		</Box>
	);
}
