"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	AppBar,
	Toolbar,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	CssBaseline,
	Tooltip,
	Divider,
	IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CategoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/Logout";
import { supabase } from "@/lib/supabaseClient";

const drawerWidth = 240;

const menuItems = [
	{ label: "Orders", icon: <ReceiptIcon />, route: "/admin/orders" },
	{ label: "Menu Editor", icon: <LocalCafeIcon />, route: "/admin/menu/edit" },
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
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

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
		return null; // Optional: loading spinner
	}

	const drawer = (
		<>
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
			</List>
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
		</>
	);

	return (
		<Box
			sx={{ display: "flex", backgroundColor: "#fdf8f4", minHeight: "100vh" }}
		>
			<CssBaseline />
			{/* Top AppBar */}
			<AppBar
				position="fixed"
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1,
					backgroundColor: "#6f4e37",
				}}
			>
				<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
					<Typography variant="h6" fontWeight={700}>
						Coffee Club Admin
					</Typography>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="end"
						onClick={handleDrawerToggle}
						sx={{ display: { sm: "none" } }}
					>
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</AppBar>

			{/* Sidebar */}
			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				aria-label="admin navigation"
			>
				{/* Mobile drawer */}
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
							backgroundColor: "#fff",
						},
					}}
				>
					{drawer}
				</Drawer>

				{/* Desktop drawer */}
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", sm: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
							backgroundColor: "#fff",
						},
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>

			{/* Main Content */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					mt: 8,
				}}
			>
				{children}
			</Box>
		</Box>
	);
}
