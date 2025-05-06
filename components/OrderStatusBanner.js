"use client";

import { useOrderStatus } from "@/context/OrderStatusContext";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, usePresence } from "framer-motion";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CoffeeMakerIcon from "@mui/icons-material/CoffeeMaker";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const steps = [
    { key: "PENDING", label: "Order Placed", icon: <HourglassTopIcon fontSize="small" /> },
    { key: "IN_PROGRESS", label: "Barista Crafting", icon: <CoffeeMakerIcon fontSize="small" /> },
    { key: "COMPLETED", label: "Order Completed", icon: <CheckCircleIcon fontSize="small" /> },
];

function AnimatedBanner({ status, orderId, onDone }) {
    const [isPresent, safeToRemove] = usePresence();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [showCircle, setShowCircle] = useState(false);

    useEffect(() => {
        if (status === "COMPLETED") {
            const t1 = setTimeout(() => setShowCircle(true), 500);
            const t2 = setTimeout(async () => {
                await fetch(`/api/orders/${orderId}/mark-stored`, { method: "POST" });
                if (safeToRemove) safeToRemove();
                onDone();
            }, 3000);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        }
    }, [status, orderId, safeToRemove, onDone]);

    const stepIndex = steps.findIndex((s) => s.key === status);

    return (
        <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            style={{
                position: "fixed",
                top: 14,
                left: 0,
                right: 0,
                margin: "0 auto",
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
            }}
        >
            <Box
                sx={{
                    width: showCircle ? 48 : "95vw",
                    maxWidth: showCircle ? undefined : 700,
                    height: showCircle ? 48 : "auto",
                    borderRadius: showCircle ? "50%" : "999px",
                    backgroundColor: showCircle ? "#4caf50" : "rgba(255,255,255,0.2)",
                    backdropFilter: showCircle ? undefined : "blur(12px)",
                    border: showCircle ? undefined : "1px solid rgba(255,255,255,0.3)",
                    boxShadow: 4,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: showCircle ? 0 : isMobile ? 2 : 3,
                    px: showCircle ? 0 : isMobile ? 2 : 3,
                    py: showCircle ? 0 : isMobile ? 0.6 : 0.8,
                    pointerEvents: "auto",
                }}
            >
                {showCircle ? (
                    <motion.div
                        key="circle"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CheckCircleIcon fontSize="medium" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="steps"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        {steps.map((step, i) => {
                            const isActive = i <= stepIndex;
                            const isCurrent = i === stepIndex;

                            return (
                                <Box
                                    key={step.key}
                                    component={motion.div}
                                    initial={{ scale: 0.95, opacity: 0.5 }}
                                    animate={{ scale: isCurrent ? 1.05 : 1, opacity: isActive ? 1 : 0.4 }}
                                    transition={{ duration: 0.3 }}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        minWidth: 70,
                                        mx: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: isActive ? "#2196f3" : "#cfd8dc",
                                            color: "#fff",
                                            borderRadius: "50%",
                                            p: 0.5,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mb: 0.4,
                                        }}
                                    >
                                        {step.icon}
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        fontSize={isMobile ? "0.6rem" : "0.7rem"}
                                        fontWeight={isCurrent ? 700 : 500}
                                        color="text.primary"
                                        sx={{ textAlign: "center" }}
                                    >
                                        {step.label}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </motion.div>
                )}
            </Box>
        </motion.div>
    );
}

export default function OrderStatusBanner() {
    const { status, orderId } = useOrderStatus();
    const [visibleBanner, setVisibleBanner] = useState(null);
    const [prevBannerKey, setPrevBannerKey] = useState(null);

    useEffect(() => {
        if (!status || !orderId) return;

        const newKey = `${orderId}-${status}`;

        if (newKey !== prevBannerKey) {
            setPrevBannerKey(newKey);
            setVisibleBanner({ status, orderId });
        }
    }, [status, orderId]);

    const handleDone = () => {
        setVisibleBanner(null);
    };

    return (
        <AnimatePresence>
            {visibleBanner && (
                <AnimatedBanner
                    key={`${visibleBanner.status}-${visibleBanner.orderId}`}
                    status={visibleBanner.status}
                    orderId={visibleBanner.orderId}
                    onDone={handleDone}
                />
            )}
        </AnimatePresence>
    );
}
