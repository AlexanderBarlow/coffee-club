"use client";

import {
  Avatar,
  Box,
  Paper,
  Typography,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";

export default function UserHeaderCard({ email, tier }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const username = email ? email.split("@")[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
          textAlign: isMobile ? "center" : "left",
          gap: 2,
          backgroundColor: "#fff",
        }}
      >
        <Avatar
          sx={{ width: 60, height: 60, bgcolor: "#6f4e37", fontWeight: 600 }}
        >
          {username ? username.charAt(0).toUpperCase() : "@"}
        </Avatar>

        <Box flex={1}>
          {username ? (
            <Typography variant="h6" fontWeight={700}>
              @{username}
            </Typography>
          ) : (
            <Skeleton width={100} height={28} />
          )}

          {tier ? (
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{
                backgroundColor: tier === "VIP" ? "#FFD700" : "#e6d3c0",
                color: "#3e3028",
                px: 2,
                py: 0.5,
                borderRadius: 99,
                display: "inline-block",
                mt: 0.5,
              }}
            >
              {tier}
            </Typography>
          ) : (
            <Skeleton width={40} height={16} sx={{ mt: 1 }} />
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}
