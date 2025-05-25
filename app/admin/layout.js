// components/admin/AdminLayout.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Typography,
  IconButton,
  CssBaseline,
  List,
  ListItem,
  Tooltip,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
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
  Groups as GroupsIcon,
  AttachMoney as AttachMoneyIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { supabase } from "@/lib/supabaseClient";

const menuItems = [
  { icon: <DashboardIcon fontSize="large" />, route: "/admin" },
  { icon: <ReceiptLongIcon fontSize="large" />, route: "/admin/orders" },
  {
    icon: <ConfirmationNumberIcon fontSize="large" />,
    route: "/admin/orders/ticket",
  },
  { icon: <AttachMoneyIcon fontSize="large" />, route: "/admin/payroll" },
  { icon: <CoffeeIcon fontSize="large" />, route: "/admin/menu/edit" },
  { icon: <AddBoxIcon fontSize="large" />, route: "/admin/menu/add-drink" },
  {
    icon: <CategoryIcon fontSize="large" />,
    route: "/admin/menu/add-category",
  },
  { icon: <PeopleIcon fontSize="large" />, route: "/admin/staff" },
  { icon: <GroupsIcon fontSize="large" />, route: "/admin/users" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return router.push("/login");
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const drawerContent = (
    <Box sx={{ width: 240, pt: 4, pb: 3, bgcolor: "#fdebe0", height: "100%" }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "#6f4e37", textAlign: "center" }}
      >
        ☕ Coffee Club
      </Typography>
      <List sx={{ p: 0, m: 0 }}>
        {menuItems.map(({ icon, route }, idx) => {
          const active = pathname.startsWith(route);
          return (
            <ListItem
              key={idx}
              disablePadding
              sx={{ mb: 1, display: "flex", justifyContent: "center" }}
            >
              <Tooltip
                title={route.replace("/admin/", "").toUpperCase() || "HOME"}
                arrow
              >
                <IconButton
                  onClick={() => {
                    router.push(route);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    color: active ? "#6f4e37" : "#a1887f",
                    bgcolor: active ? "rgba(111,78,55,0.2)" : "transparent",
                    width: 56,
                    height: 56,
                    "&:hover": { bgcolor: "rgba(111,78,55,0.12)" },
                  }}
                >
                  {icon}
                </IconButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Tooltip title="Logout" arrow>
        <IconButton
          onClick={handleLogout}
          sx={{ color: "#6f4e37", width: 56, height: 56, mx: "auto" }}
        >
          <LogoutIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  if (loading) return null;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        bgcolor: "#fdf8f4",
      }}
    >
      <CssBaseline />
      {isMobile ? (
        <>
          <AppBar position="fixed" sx={{ bgcolor: "#6f4e37" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
              <Tooltip title="Logout" arrow>
                <IconButton color="inherit" onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
            }}
          >
            {drawerContent}
          </Drawer>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              mt: 8,
              overflowY: "auto",
              p: 2,
              bgcolor: "#fffaf0",
            }}
          >
            {children}
          </Box>
        </>
      ) : (
        <>
          {/* Desktop Sidebar */}
          <Box sx={{ width: 80, flexShrink: 0 }}>{drawerContent}</Box>
          {/* Main Content */}
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 6, overflowY: "auto", bgcolor: "#fffaf0" }}
          >
            {children}
          </Box>
        </>
      )}
    </Box>
  );
}
