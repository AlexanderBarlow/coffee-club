"use client";

import { useOrderStatus } from "@/context/OrderStatusContext";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const statusConfig = {
    PENDING: {
        color: "#ff9800",
        icon: <HourglassTopIcon sx={{ mr: 1 }} />,
        label: "Pending",
    },
    IN_PROGRESS: {
        color: "#2196f3",
        icon: <LocalShippingIcon sx={{ mr: 1 }} />,
        label: "In Progress",
    },
    COMPLETED: {
        color: "#4caf50",
        icon: <CheckCircleIcon sx={{ mr: 1 }} />,
        label: "Completed",
    },
};

export default function OrderStatusBanner() {
    const { status, orderId } = useOrderStatus();
    const current = statusConfig[status];

    if (!status || !current) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={status}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
            >
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 80,
                        right: 16,
                        zIndex: 9999,
                        backgroundColor: current.color,
                        color: "#fff",
                        px: 3,
                        py: 1.5,
                        borderRadius: 3,
                        boxShadow: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        minWidth: 260,
                    }}
                >
                    {current.icon}
                    <Typography variant="body2" fontWeight={600}>
                        Order #{orderId?.slice(0, 6)} is {current.label}
                    </Typography>
                </Box>
            </motion.div>
        </AnimatePresence>
    );
}
