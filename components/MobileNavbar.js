"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Paper,
	Badge,
	BottomNavigation,
	BottomNavigationAction,
	IconButton,
	Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/HomeRounded";
import LocalCafeIcon from "@mui/icons-material/LocalCafeRounded";
import EmojiEventsIcon from "@mui/icons-material/EmojiEventsRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartRounded";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import { supabase } from "@/lib/supabaseClient";

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

	const navItems = [
		{ label: "Home", icon: <HomeIcon fontSize="medium" />, path: "/dashboard" },
		{ label: "Menu", icon: <LocalCafeIcon fontSize="medium" />, path: "/menu" },
		{
			label: "Rewards",
			icon: <EmojiEventsIcon fontSize="medium" />,
			path: "/rewards",
		},
		{
			label: "Cart",
			icon: (
				<Badge
					badgeContent={cartCount}
					color="error"
					invisible={cartCount === 0}
				>
					<ShoppingCartIcon fontSize="medium" />
				</Badge>
			),
			path: "/cart",
		},
	];

	useEffect(() => {
		setCartCount(getCartItemCount());
		const handleStorage = () => setCartCount(getCartItemCount());
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push("/login");
	};

	return (
		<Paper
			elevation={10}
			sx={{
				position: "fixed",
				bottom: 12,
				left: 16,
				right: 16,
				borderRadius: "20px",
				backdropFilter: "blur(12px)",
				backgroundColor: "rgba(255,255,255,0.95)",
				boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
				zIndex: 1000,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				px: 1,
			}}
		>
			<BottomNavigation
				showLabels
				value={pathname}
				onChange={(event, newValue) => router.push(newValue)}
				sx={{
					background: "transparent",
					width: "100%",
					justifyContent: "space-evenly",
				}}
			>
				{navItems.map((item) => (
					<BottomNavigationAction
						key={item.path}
						label={item.label}
						icon={item.icon}
						value={item.path}
						component={motion.button}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						sx={{
							color: pathname === item.path ? "#6f4e37" : "#888",
							"& .MuiBottomNavigationAction-label": {
								fontWeight: 600,
								fontSize: "0.75rem",
								mt: 0.5,
							},
							paddingY: 1.5,
							borderRadius: 3,
						}}
					/>
				))}
			</BottomNavigation>

			<Tooltip title="Log out" placement="top">
				<motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
					<IconButton onClick={handleLogout} sx={{ ml: 1 }}>
						<LogoutIcon sx={{ color: "#6f4e37" }} />
					</IconButton>
				</motion.div>
			</Tooltip>
		</Paper>
	);
}
