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
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  { label: "Dashboard", icon: <DashboardIcon />, route: "/admin" },
  { label: "Orders", icon: <ReceiptLongIcon />, route: "/admin/orders" },
  {
    label: "Tickets",
    icon: <ConfirmationNumberIcon />,
    route: "/admin/orders/ticket",
  },
  { label: "Payroll", icon: <AttachMoneyIcon />, route: "/admin/payroll" },
  { label: "Menu", icon: <CoffeeIcon />, route: "/admin/menu/edit" },
  { label: "Add Item", icon: <AddBoxIcon />, route: "/admin/menu/add-drink" },
  {
    label: "Category",
    icon: <CategoryIcon />,
    route: "/admin/menu/add-category",
  },
  { label: "Staff", icon: <PeopleIcon />, route: "/admin/staff" },
  { label: "Users", icon: <GroupsIcon />, route: "/admin/users" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Client‐side auth check
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return router.push("/login");
      setLoading(false);
    })();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const drawerWidth = isMobile ? 240 : 80;
  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: "#fdebe0",
        height: "100%",
        pt: 2,
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, textAlign: "center", color: "#6f4e37" }}
      >
        ☕ Coffee Club
      </Typography>
      <List>
        {menuItems.map(({ label, icon, route }, idx) => {
          const active = pathname === route;
          return (
            <ListItem key={idx} disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push(route);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  py: 1,
                  px: isMobile ? 2 : 0,
                  justifyContent: isMobile ? "flex-start" : "center",
                  bgcolor: active ? "rgba(111,78,55,0.2)" : "transparent",
                  "&:hover": { bgcolor: "rgba(111,78,55,0.12)" },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "#6f4e37" : "#a1887f",
                    minWidth: 0,
                    mr: isMobile ? 2 : 0,
                    justifyContent: "center",
                  }}
                >
                  {React.cloneElement(icon, {
                    fontSize: isMobile ? "medium" : "large",
                  })}
                </ListItemIcon>
                {isMobile && (
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: "0.9rem",
                      fontWeight: active ? 600 : 500,
                      color: active ? "#6f4e37" : "inherit",
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <ListItem disablePadding>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            py: 1,
            px: isMobile ? 2 : 0,
            justifyContent: isMobile ? "flex-start" : "center",
          }}
        >
          <ListItemIcon
            sx={{
              color: "#6f4e37",
              minWidth: 0,
              mr: isMobile ? 2 : 0,
              justifyContent: "center",
            }}
          >
            <LogoutIcon fontSize={isMobile ? "medium" : "large"} />
          </ListItemIcon>
          {isMobile && (
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    </Box>
  );

  if (loading) return null;

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <CssBaseline />

      {isMobile ? (
        <>
          <AppBar position="fixed" sx={{ bgcolor: "#6f4e37" }}>
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>

          <Box
            component="main"
            sx={{ flexGrow: 1, mt: 8, p: 2, overflow: "auto" }}
          >
            {children}
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ width: drawerWidth, flexShrink: 0 }}>{drawer}</Box>
          <Box component="main" sx={{ flexGrow: 1, p: 6, overflow: "auto" }}>
            {children}
          </Box>
        </>
      )}
    </Box>
  );
}
