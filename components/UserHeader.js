// File: components/UserHeader.js
"use client";

import { Avatar, Box, Typography, Skeleton } from "@mui/material";

export default function UserHeader({ email, tier }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                textAlign: { xs: "center", sm: "left" },
                mb: 4,
            }}
        >
            <Avatar sx={{ width: 56, height: 56, bgcolor: "#6f4e37" }}>@</Avatar>
            <Box>
                <Typography variant="h6" fontWeight={700}>
                    @{email?.split("@")[0] || <Skeleton width={80} />}
                </Typography>
                <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{
                        backgroundColor: tier === "VIP" ? "#FFD700" : "#e6d3c0",
                        px: 2,
                        py: 0.5,
                        borderRadius: 99,
                        mt: 0.5,
                        display: "inline-block",
                    }}
                >
                    {tier || <Skeleton width={40} />}
                </Typography>
            </Box>
        </Box>
    );
}
