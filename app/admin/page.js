"use client";

<<<<<<< HEAD
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
=======
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	AppBar,
	Toolbar,
	IconButton,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	CssBaseline,
	Tooltip,
	Divider,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CategoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/Logout";
import { supabase } from "@/lib/supabaseClient";

const drawerWidth = 240;

const menuItems = [
	{ label: "Orders", icon: <ReceiptIcon />, route: "/admin/orders" },
	{ label: "Menu Editor", icon: <LocalCafeIcon />, route: "/admin/menu" },
	{
		label: "Add Drink",
		icon: <AddCircleIcon />,
		route: "/admin/menu/add-drink",
	},
	{
		label: "Add Category",
		icon: <CategoryIcon />,
		route: "/admin/menu/add-category",
	},
];

export default function AdminLayout({ children }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) return router.push("/login");

			const { data: userData } = await supabase.auth.getUser();
			const user = userData?.user;

			if (!user?.email || !user.email.includes("@")) {
				router.push("/login");
			} else {
				setLoading(false);
			}
		};

		checkAuth();
	}, [router]);

	if (loading) {
		return null; // Optional: Add spinner here
	}

	return (
		<Box
			sx={{ display: "flex", backgroundColor: "#fdf8f4", minHeight: "100vh" }}
		>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1,
					backgroundColor: "#6f4e37",
				}}
			>
				<Toolbar>
					<Typography variant="h6" noWrap component="div" fontWeight={700}>
						Coffee Club Admin
					</Typography>
				</Toolbar>
			</AppBar>

			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: "border-box",
						backgroundColor: "#fff",
					},
				}}
			>
				<Toolbar />
				<Divider />
				<List>
					{menuItems.map((item) => (
						<ListItem key={item.label} disablePadding>
							<Tooltip title={item.label} placement="right">
								<ListItemButton onClick={() => router.push(item.route)}>
									<ListItemIcon sx={{ color: "#6f4e37" }}>
										{item.icon}
									</ListItemIcon>
									<ListItemText primary={item.label} />
								</ListItemButton>
							</Tooltip>
						</ListItem>
					))}

					<Divider sx={{ my: 2 }} />

					<ListItem disablePadding>
						<Tooltip title="Logout" placement="right">
							<ListItemButton
								onClick={async () => {
									await supabase.auth.signOut();
									router.push("/login");
								}}
							>
								<ListItemIcon sx={{ color: "#9e6f50" }}>
									<LogoutIcon />
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItemButton>
						</Tooltip>
					</ListItem>
				</List>
			</Drawer>

			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				{children}
			</Box>
>>>>>>> 4614f86 (initial commit)
		</Box>
	);
}
