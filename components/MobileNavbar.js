"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	BottomNavigation,
	BottomNavigationAction,
	Paper,
	Badge,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// Temporary mock cart count (replace with context/store later)
const getCartItemCount = () => {
	if (typeof window !== "undefined") {
		const cart = JSON.parse(localStorage.getItem("cart") || "[]");
		return cart.length;
	}
	return 0;
};

export default function BottomTabBar() {
	const pathname = usePathname();
	const router = useRouter();
	const [cartCount, setCartCount] = useState(0);

	useEffect(() => {
		// Initialize cart count from localStorage
		setCartCount(getCartItemCount());

		// Optional: Listen to cart updates via storage events
		const handleStorage = () => setCartCount(getCartItemCount());
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	const navItems = [
		{ label: "Home", icon: <HomeIcon />, path: "/dashboard" },
		{ label: "Menu", icon: <LocalCafeIcon />, path: "/menu" },
		{ label: "Rewards", icon: <EmojiEventsIcon />, path: "/rewards" },
		{
			label: "Cart",
			icon: (
				<Badge
					badgeContent={cartCount}
					color="secondary"
					invisible={cartCount === 0}
				>
					<ShoppingCartIcon />
				</Badge>
			),
			path: "/cart",
		},
	];

	const activeIndex = navItems.findIndex((item) =>
		pathname.startsWith(item.path)
	);

	return (
		<Paper
			elevation={6}
			sx={{
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
				borderTopLeftRadius: 16,
				borderTopRightRadius: 16,
			}}
		>
			<BottomNavigation
				showLabels
				value={activeIndex}
				onChange={(event, newValue) => {
					router.push(navItems[newValue].path);
				}}
				sx={{ borderRadius: "inherit", background: "#fff" }}
			>
				{navItems.map((item) => (
					<BottomNavigationAction
						key={item.path}
						label={item.label}
						icon={item.icon}
						component={motion.button}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						sx={{
							"&.Mui-selected": {
								color: "#6f4e37",
							},
							borderRadius: 3,
						}}
					/>
				))}
			</BottomNavigation>
		</Paper>
	);
}
