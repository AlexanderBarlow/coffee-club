// components/admin/AdminLayout.jsx
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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ReceiptLong as ReceiptLongIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  LocalCafe as CoffeeIcon,
  AddBox as AddBoxIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";

import { supabase } from "@/lib/supabaseClient";

const drawerWidth = 280;
const blurBg = "rgba(255, 255, 255, 0.6)";

const menuItems = [
  { label: "Home", icon: <DashboardIcon />, route: "/admin" },
  { label: "Orders", icon: <ReceiptLongIcon />, route: "/admin/orders" },
  {
    label: "Tickets",
    icon: <ConfirmationNumberIcon />,
    route: "/admin/orders/ticket",
  },
  { label: "Menu Editor", icon: <CoffeeIcon />, route: "/admin/menu/edit" },
  { label: "Add Item", icon: <AddBoxIcon />, route: "/admin/menu/add-drink" },
  {
    label: "Add Category",
    icon: <CategoryIcon />,
    route: "/admin/menu/add-category",
  },
  { label: "Staff", icon: <PeopleIcon />, route: "/admin/staff" },
  { label: "Users", icon: <GroupsIcon />, route: "/admin/users" },
  { label: "Payroll", icon: <GroupsIcon />, route: "/admin/payroll" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return router.push("/login");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email?.includes("@")) return router.push("/login");
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  if (loading) return null;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography variant="h6" fontWeight={700} color="#6f4e37">
          Admin Menu
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive =
            item.route === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.route);

          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <Tooltip title={item.label} placement="right" arrow>
                <ListItemButton
                  onClick={() => router.push(item.route)}
                  sx={{
                    borderRadius: 3,
                    mb: 0.5,
                    px: 2,
                    py: 1.5,
                    background: isActive
                      ? `linear-gradient(135deg, rgba(111,78,55,0.15) 0%, rgba(111,78,55,0.05) 100%)`
                      : "transparent",
                    backdropFilter: isActive ? "blur(4px)" : "none",
                    borderLeft: isActive
                      ? `3px solid ${theme.palette.primary.light}`
                      : "3px solid transparent",
                    "&:hover": {
                      background: isActive
                        ? `linear-gradient(135deg, rgba(111,78,55,0.18) 0%, rgba(111,78,55,0.08) 100%)`
                        : `rgba(111,78,55,0.04)`,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        background: isActive
                          ? theme.palette.primary.light
                          : blurBg,
                        borderRadius: "50%",
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isActive ? "#fff" : theme.palette.text.primary,
                      }}
                    >
                      {item.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: isActive ? theme.palette.primary.light : "#3e3028",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          sx={{
            borderRadius: 3,
            background: `linear-gradient(135deg, rgba(111,78,55,0.15) 0%, rgba(111,78,55,0.05) 100%)`,
            backdropFilter: "blur(4px)",
            "&:hover": {
              background: `linear-gradient(135deg, rgba(111,78,55,0.18) 0%, rgba(111,78,55,0.08) 100%)`,
            },
            p: 1.5,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Box
              sx={{
                background: theme.palette.error.light,
                borderRadius: "50%",
                p: 1,
                color: "#fff",
              }}
            >
              <LogoutIcon />
            </Box>
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#fdf8f4" }}
    >
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: "rgba(111, 78, 55, 0.85)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            noWrap
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, fontWeight: 700 }}
          >
            Coffee Club Admin
          </Typography>
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
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
              background: blurBg,
              backdropFilter: "blur(12px)",
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
              background: blurBg,
              backdropFilter: "blur(12px)",
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
