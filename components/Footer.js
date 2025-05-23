"use client";

import { Box, Typography, IconButton, Button } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                mt: 4,
                py: 3,
                px: 2,
                pt: 0,
                backgroundColor: "#fdf8f4",
                borderTop: "1px solid #e0e0e0",
                textAlign: "center",
            }}
        >
            <Typography variant="body1" fontWeight={600} mb={1}>
                Follow Us
            </Typography>
            <Box display="flex" justifyContent="center" gap={2} mb={2}>
                <IconButton href="https://facebook.com" target="_blank" color="primary">
                    <Facebook />
                </IconButton>
                <IconButton href="https://instagram.com" target="_blank" color="primary">
                    <Instagram />
                </IconButton>
                <IconButton href="https://twitter.com" target="_blank" color="primary">
                    <Twitter />
                </IconButton>
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    if (window.matchMedia("(display-mode: standalone)").matches) return;
                    window.location.href = "/manifest.json";
                }}
            >
                Get the App
            </Button>
            <Typography variant="caption" display="block" mt={2}>
                © {new Date().getFullYear()} Coffee Club. All rights reserved.
            </Typography>
        </Box>
    );
}
