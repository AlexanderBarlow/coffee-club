"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const navItems = [
	{ label: "Home", icon: <HomeIcon />, path: "/dashboard" },
	{ label: "Menu", icon: <LocalCafeIcon />, path: "/icedcoffee" },
	{ label: "Rewards", icon: <EmojiEventsIcon />, path: "/rewards" },
	{ label: "Profile", icon: <AccountCircleIcon />, path: "/profile" },
];

export default function BottomTabBar() {
	const pathname = usePathname();
	const router = useRouter();

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
				{navItems.map((item, index) => (
					<motion.div
						key={item.path}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						style={{ flex: 1 }}
					>
						<BottomNavigationAction
							label={item.label}
							icon={item.icon}
							sx={{
								"&.Mui-selected": {
									color: "#6f4e37",
								},
							}}
						/>
					</motion.div>
				))}
			</BottomNavigation>
		</Paper>
	);
}
