"use client";

import { motion } from "framer-motion";
import { Button as MuiButton } from "@mui/material";

export default function Button({
  children,
  onClick,
  variant = "contained", // or "outlined"
  fullWidth = false,
  color = "primary",
  ...props
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: fullWidth ? "block" : "inline-block",
        width: fullWidth ? "100%" : "auto",
      }}
    >
      <MuiButton
        onClick={onClick}
        variant={variant}
        color={color}
        fullWidth={fullWidth}
        sx={{
          py: 1.5,
          px: 3,
          borderRadius: "12px",
          fontWeight: 600,
          fontSize: "1rem",
          textTransform: "none",
          boxShadow: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        }}
        {...props}
      >
        {children}
      </MuiButton>
    </motion.div>
  );
}
