// components/admin/MenuLayout.jsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tabs, Tab, Box, Paper } from "@mui/material";

export default function MenuLayout({ children }) {
    const pathname = usePathname();
    const base = "/admin/menu";

    const tabs = [
        { label: "Edit Menu", href: `${base}/edit` },
        { label: "Add Item", href: `${base}/add-drink` },
        { label: "Categories", href: `${base}/add-category` },
    ];

    // find which tab is active (default to 0)
    const value = Math.max(0, tabs.findIndex((t) => pathname.startsWith(t.href)));

    return (
        <Box sx={{ p: 3 }}>
            {/* Centered flex wrapper */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Paper
                    elevation={6}
                    sx={{
                        px: 1,
                        bgcolor: "rgba(255,255,255,0.75)",
                        backdropFilter: "blur(8px)",
                        borderRadius: 3,
                    }}
                >
                    <Tabs
                        value={value}
                        variant="standard"
                        TabIndicatorProps={{ sx: { display: "none" } }}
                    >
                        {tabs.map((t, i) => (
                            <Tab
                                key={t.href}
                                label={t.label}
                                component={Link}
                                href={t.href}
                                value={i}
                                sx={{
                                    textTransform: "none",
                                    mx: 0.5,
                                    px: 2, py: 1,
                                    borderRadius: 2,
                                    minWidth: 100,
                                    bgcolor: i === value
                                        ? "rgba(111,78,55,0.2)"
                                        : "transparent",
                                    "&:hover": { bgcolor: "rgba(111,78,55,0.1)" },
                                }}
                            />
                        ))}
                    </Tabs>
                </Paper>
            </Box>

            {/* Render the child page */}
            <Box>
                {children}
            </Box>
        </Box>
    );
}
