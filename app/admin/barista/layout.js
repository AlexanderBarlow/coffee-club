"use client";

import { Box, Toolbar, CssBaseline, AppBar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Coffee, AccessTime, Logout } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const drawerWidth = 240;

const baristaMenu = [
    { label: "Punch Clock", icon: <AccessTime />, route: "/admin/barista/punch" },
    { label: "Tickets", icon: <Coffee />, route: "/admin/barista" },
];

export default function BaristaLayout({ children }) {
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) router.push("/login");
        });
    }, [router]);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: "#6f4e37" }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Barista Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
                }}
            >
                <Toolbar />
                <List>
                    {baristaMenu.map((item) => (
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
                                <Logout />
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
