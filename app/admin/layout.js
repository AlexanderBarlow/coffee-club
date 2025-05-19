"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Typography,
  CssBaseline,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CoffeeIcon from "@mui/icons-material/LocalCafe";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CategoryIcon from "@mui/icons-material/Category";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

import { supabase } from "@/lib/supabaseClient";

const drawerWidth = 240;

const menuItems = [
  { label: "Home", icon: <DashboardIcon />, route: "/admin" },
  { label: "Orders", icon: <ReceiptLongIcon />, route: "/admin/orders" },
  { label: "Menu Editor", icon: <CoffeeIcon />, route: "/admin/menu/edit" },
  { label: "Add Item", icon: <AddBoxIcon />, route: "/admin/menu/add-drink" },
  { label: "Add Category", icon: <CategoryIcon />, route: "/admin/menu/add-category" },
  { label: "Tickets", icon: <ConfirmationNumberIcon />, route: "/admin/orders/ticket" },
  { label: "Staff", icon: <PeopleIcon />, route: "/admin/staff" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  useEffect(() => {
    setMobileOpen(false); // Close drawer on route change
  }, [pathname]);

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

  if (loading) return null;

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <Tooltip title={item.label} placement="right">
              <ListItemButton onClick={() => router.push(item.route)}>
                <ListItemIcon sx={{ color: "#6f4e37" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 1 }}>
        <ListItemButton
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          sx={{
            borderRadius: 2,
            backgroundColor: "#fdece2",
            "&:hover": { backgroundColor: "#fdd4b0" },
          }}
        >
          <ListItemIcon sx={{ color: "#9e6f50" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#fdf8f4" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#6f4e37",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700} noWrap>
            Coffee Club Admin
          </Typography>
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#fff",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#fff",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          p: { xs: 2, md: 4 },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
