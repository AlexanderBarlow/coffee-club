"use client";

import { Avatar, Box, Paper, Typography, Skeleton } from "@mui/material";

const tierStyles = {
  BRONZE: {
    bg: "#fdf8f4",
    badge: "#e6d3c0",
    color: "#6f4e37",
  },
  SILVER: {
    bg: "#f8f9fa",
    badge: "#c0c0c0",
    color: "#7b7b7b",
  },
  GOLD: {
    bg: "#fff9e6",
    badge: "#d4af37",
    color: "#9e7b00",
  },
  VIP: {
    bg: "#1f1f1f",
    badge: "#ffd700",
    color: "#ffffff",
  },
};

export default function UserProfileCard({ email, tier = "BRONZE", isMobile }) {
  const username = email ? email.split("@")[0] : null;
  const styles = tierStyles[tier] || tierStyles.BRONZE;

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 4,
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexDirection: isMobile ? "column" : "row",
        textAlign: isMobile ? "center" : "left",
        backgroundColor: styles.bg,
        color: styles.color,
      }}
    >
      <Avatar sx={{ width: 56, height: 56, bgcolor: styles.color }}>@</Avatar>
      <Box flex={1}>
        {username ? (
          <Typography variant="h6" fontWeight={700}>
            @{username}
          </Typography>
        ) : (
          <Skeleton width={80} height={28} />
        )}

        {tier ? (
          <Typography
            variant="caption"
            fontWeight={600}
            sx={{
              backgroundColor: styles.badge,
              px: 2,
              py: 0.5,
              borderRadius: 99,
              mt: 0.5,
              display: "inline-block",
              color: tier === "VIP" ? "#000" : "inherit",
            }}
          >
            {tier}
          </Typography>
        ) : (
          <Skeleton width={40} height={16} sx={{ mt: 1 }} />
        )}
      </Box>
    </Paper>
  );
}
