"use client";

import { useOrderStatus } from "@/context/OrderStatusContext";
import { Box, Typography, useMediaQuery, useTheme, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, usePresence } from "framer-motion";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CoffeeMakerIcon from "@mui/icons-material/CoffeeMaker";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

const steps = [
    { key: "PENDING", label: "Order Placed", icon: <HourglassTopIcon fontSize="small" /> },
    { key: "IN_PROGRESS", label: "Crafting", icon: <CoffeeMakerIcon fontSize="small" /> },
    { key: "COMPLETED", label: "Completed", icon: <CheckCircleIcon fontSize="small" /> },
];

function AnimatedBanner({ status, orderId, onDone }) {
    const [isPresent, safeToRemove] = usePresence();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [showCircle, setShowCircle] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (status === "COMPLETED") {
            const t1 = setTimeout(() => setShowCircle(true), 300);
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

    if (dismissed) return null;
    const stepIndex = steps.findIndex((s) => s.key === status);

    return (
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{
                position: "fixed",
                top: 12,
                left: 0,
                right: 0,
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
            }}
        >
            <Box
                sx={{
                    width: showCircle ? 42 : "auto",
                    maxWidth: "95vw",
                    px: showCircle ? 0 : 2,
                    py: showCircle ? 0 : 1,
                    height: showCircle ? 42 : "auto",
                    borderRadius: showCircle ? "50%" : 2,
                    backgroundColor: showCircle ? "#4caf50" : "rgba(33,33,33,0.9)",
                    backdropFilter: showCircle ? undefined : "blur(10px)",
                    boxShadow: 4,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    pointerEvents: "auto",
                }}
            >
                {showCircle ? (
                    <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <CheckCircleIcon fontSize="medium" />
                    </motion.div>
                ) : (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: isMobile ? 1.5 : 3,
                            }}
                        >
                            {steps.map((step, i) => {
                                const isActive = i <= stepIndex;
                                const isCurrent = i === stepIndex;

                                return (
                                    <Box
                                        key={step.key}
                                        component={motion.div}
                                        initial={{ scale: 0.95, opacity: 0.5 }}
                                        animate={{
                                            scale: isCurrent ? 1.1 : 1,
                                            opacity: isActive ? 1 : 0.4,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            minWidth: 50,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                backgroundColor: isActive ? "#90caf9" : "#616161",
                                                color: "#fff",
                                                borderRadius: "50%",
                                                width: 24,
                                                height: 24,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mb: 0.5,
                                            }}
                                        >
                                            {step.icon}
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            fontSize="0.65rem"
                                            fontWeight={isCurrent ? 600 : 400}
                                            sx={{ color: "#e0e0e0", lineHeight: 1 }}
                                        >
                                            {step.label}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>

                        <IconButton
                            onClick={() => setDismissed(true)}
                            size="small"
                            sx={{
                                color: "#ccc",
                                "&:hover": { color: "#fff" },
                                ml: 1,
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </>
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
        if (!status || !orderId) {
            setVisibleBanner(null);
            return;
        }

        const newKey = `${orderId}-${status}`;
        if (newKey !== prevBannerKey) {
            setPrevBannerKey(newKey);
            setVisibleBanner({ status, orderId });
        }
    }, [status, orderId]);

    return (
        <AnimatePresence>
            {visibleBanner && (
                <AnimatedBanner
                    key={`${visibleBanner.status}-${visibleBanner.orderId}`}
                    status={visibleBanner.status}
                    orderId={visibleBanner.orderId}
                    onDone={() => setVisibleBanner(null)}
                />
            )}
        </AnimatePresence>
    );
}
