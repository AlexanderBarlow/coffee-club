"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ drink, customization }) {
	const router = useRouter();
	const { addToCart } = useCart();

	const handleClick = () => {
		if (!drink) {
			console.error("🚨 No drink provided to AddToCartButton");
			return;
		}

		const cartItem = {
			id: drink.id,
			name: drink.name,
			price: drink.price,
			imageUrl: drink.imageUrl,
			customization,
		};

		addToCart(cartItem);
		router.push("/cart");
	};

	return (
		<Button
			fullWidth
			variant="contained"
			sx={{
				mt: 2,
				py: 1.5,
				borderRadius: 2,
				backgroundColor: "#6f4e37",
				fontWeight: 600,
				fontSize: "1rem",
				"&:hover": {
					backgroundColor: "#5c3e2e",
				},
			}}
			onClick={handleClick}
		>
			Add to Cart
		</Button>
	);
}
