// components/admin/AdminLayout.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  ReceiptLong as ReceiptLongIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  AttachMoney as AttachMoneyIcon,
  LocalCafe as CoffeeIcon,
  AddBox as AddBoxIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";

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

  // Dummy auth-check
  useEffect(() => {
    (async () => {
      // await supabase.auth.getSession()...
      setLoading(false);
    })();
  }, []);

  if (loading) return null;

  const handleLogout = () => {
    // supabase.auth.signOut()...
    router.push("/login");
  };

  const drawerWidth = isMobile ? 240 : 200;
  const frosted = {
    bgcolor: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  };

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        py: 2,
        ...frosted,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ mb: 3, color: "#6f4e37", fontWeight: 700 }}
      >
        ☕ Coffee Club
      </Typography>
      <List>
        {menuItems.map(({ label, icon, route }) => {
          const active = pathname === route;
          return (
            <ListItem key={route} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  router.push(route);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  px: isMobile ? 2 : 3,
                  py: 1.5,
                  background: active ? "rgba(111,78,55,0.15)" : "transparent",
                  "&:hover": { background: "rgba(111,78,55,0.1)" },
                  justifyContent: isMobile ? "flex-start" : "flex-start",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? theme.palette.primary.main : "#555",
                    minWidth: 40,
                  }}
                >
                  {React.cloneElement(icon, { fontSize: "medium" })}
                </ListItemIcon>

                {/* Always show text now */}
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: "1rem",
                    fontWeight: active ? 600 : 500,
                    color: active ? theme.palette.primary.main : "#333",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            mx: 1,
            px: 2,
            py: 1.5,
            background: "rgba(255,100,100,0.2)",
            "&:hover": { background: "rgba(255,100,100,0.3)" },
          }}
        >
          <ListItemIcon sx={{ color: "#c00", minWidth: 40 }}>
            <LogoutIcon fontSize="medium" />
          </ListItemIcon>
          {isMobile && (
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: "1rem", fontWeight: 500 }}
            />
          )}
        </ListItemButton>
      </ListItem>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <CssBaseline />

      {isMobile ? (
        <>
          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              ...frosted,
              borderBottom: "1px solid rgba(111,78,55,0.2)",
            }}
          >
            <Toolbar>
              <IconButton edge="start" onClick={() => setMobileOpen(true)}>
                <MenuIcon htmlColor="#6f4e37" />
              </IconButton>

              <Typography
                variant="h6"
                sx={{ flexGrow: 1, textAlign: "center", color: "#6f4e37" }}
              >
                Coffee Club Admin
              </Typography>

              <IconButton onClick={handleLogout}>
                <LogoutIcon htmlColor="#6f4e37" />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            PaperProps={{ sx: frosted, width: drawerWidth }}
          >
            {drawerContent}
          </Drawer>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              mt: 8,
              p: 2,
              overflow: "auto",
              bgcolor: "#f5f2ee",
            }}
          >
            {children}
          </Box>
        </>
      ) : (
        <>
          <Box
            component="nav"
            sx={{ ...frosted, width: drawerWidth, flexShrink: 0 }}
          >
            {drawerContent}
          </Box>

          <Box
            component="main"
            sx={{ flexGrow: 1, p: 6, overflow: "auto", bgcolor: "#f5f2ee" }}
          >
            {children}
          </Box>
        </>
      )}
    </Box>
  );
}
