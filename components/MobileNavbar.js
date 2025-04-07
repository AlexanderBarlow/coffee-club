"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Paper,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
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

export default function ResponsiveNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [cartCount, setCartCount] = useState(0);

  const navItems = [
    { label: "Home", icon: <HomeIcon />, path: "/dashboard" },
    { label: "Menu", icon: <LocalCafeIcon />, path: "/menu" },
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
    const handleStorage = () => setCartCount(getCartItemCount());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const activeIndex = Math.max(
    navItems.findIndex((item) => pathname.startsWith(item.path)),
    0
  );

  // Hide nav on auth pages
  if (["/login", "/signup", "/verify"].includes(pathname)) return null;

  if (isMobile) {
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

  // Desktop Navbar
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "none",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <div>
          {navItems.slice(0, 3).map((item) => (
            <Button
              key={item.path}
              onClick={() => router.push(item.path)}
              sx={{
                color: pathname.startsWith(item.path) ? "#6f4e37" : "#888",
                textTransform: "none",
                fontWeight: 600,
                mr: 2,
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <IconButton onClick={() => router.push("/cart")}>
          <Badge badgeContent={cartCount} color="error">
            <ShoppingCartIcon sx={{ color: "#6f4e37" }} />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
