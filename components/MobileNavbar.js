"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Badge,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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

export default function ResponsiveNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [cartCount, setCartCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navItems = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Menu", icon: <LocalCafeIcon />, path: "/menu" },
  ];

  const authNavItems = [
    ...navItems,
    { label: "Rewards", icon: <EmojiEventsIcon />, path: "/rewards" },
    {
      label: "Cart",
      icon: (
        <Badge
          badgeContent={cartCount}
          color="error"
          invisible={cartCount === 0}
        >
          <ShoppingCartIcon />
        </Badge>
      ),
      path: "/cart",
    },
  ];

  useEffect(() => {
    setCartCount(getCartItemCount());

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const handleStorage = () => setCartCount(getCartItemCount());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDrawerOpen(false);
    router.push("/login");
  };

  const navTo = (path) => {
    setDrawerOpen(false);
    router.push(path);
  };

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  if (["/verify"].includes(pathname)) return null;

  const displayedItems = isAuthenticated ? authNavItems : navItems;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#fff",
          boxShadow: "none",
          borderBottom: "1px solid #ddd",
          zIndex: 1201,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {isMobile ? (
            <>
              <IconButton edge="start" onClick={toggleDrawer}>
                <MenuIcon sx={{ color: "#6f4e37" }} />
              </IconButton>
              <Typography variant="h6" fontWeight={700} color="primary">
                Coffee Club
              </Typography>
              <Box width={48} />
            </>
          ) : (
            <>
              <Box>
                {displayedItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    sx={{
                      color: pathname.startsWith(item.path)
                        ? "#6f4e37"
                        : "#888",
                      textTransform: "none",
                      fontWeight: 600,
                      mr: 2,
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
              {isAuthenticated && (
                <IconButton onClick={handleLogout}>
                  <LogoutIcon sx={{ color: "#6f4e37" }} />
                </IconButton>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <List sx={{ width: 250 }}>
          {displayedItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton onClick={() => navTo(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          {isAuthenticated && (
            <>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
      <Toolbar /> {/* Push page content down below AppBar */}
    </>
  );
}
