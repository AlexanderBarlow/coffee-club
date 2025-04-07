"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import LogoutIcon from "@mui/icons-material/Logout";
import { supabase } from "@/lib/supabaseClient";

const drawerWidth = 240;

const menuItems = [
	{ label: "Orders", icon: <ReceiptIcon />, route: "/admin/orders" },
	{ label: "Menu Editor", icon: <LocalCafeIcon />, route: "/admin/menu" },
];

export default function AdminLayout({ children }) {
	const router = useRouter();

	useEffect(() => {
		// Optional: Restrict access to admin users only
		const checkAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) return router.push("/login");
			const { data: user } = await supabase.auth.getUser();
			if (!user?.user?.email?.includes("@")) return router.push("/login");

			// Optional: Fetch from DB if using isAdmin flag
		};

		checkAuth();
	}, [router]);

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
				color="primary"
			>
				<Toolbar>
					<Typography variant="h6" noWrap component="div">
						Admin Dashboard
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
					},
				}}
			>
				<Toolbar />
				<List>
					{menuItems.map((item) => (
						<ListItem key={item.label} disablePadding>
							<ListItemButton onClick={() => router.push(item.route)}>
								<ListItemIcon>{item.icon}</ListItemIcon>
								<ListItemText primary={item.label} />
							</ListItemButton>
						</ListItem>
					))}
					<ListItem disablePadding>
						<ListItemButton
							onClick={async () => {
								await supabase.auth.signOut();
								router.push("/login");
							}}
						>
							<ListItemIcon>
								<LogoutIcon />
							</ListItemIcon>
							<ListItemText primary="Logout" />
						</ListItemButton>
					</ListItem>
				</List>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
}
