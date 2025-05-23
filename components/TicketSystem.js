"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Chip,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

const SIZE_MAP = {
    S: "Small",
    M: "Medium",
    L: "Large",
    XL: "Extra Large",
    SM: "Small",
    MD: "Medium",
    LG: "Large",
};

export default function TicketBoard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claimingId, setClaimingId] = useState(null);
    const [completingId, setCompletingId] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, orderId: null });

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            const activeOrders = data.filter(
                (order) => order.status === "PENDING" || order.status === "IN_PROGRESS"
            );
            setOrders(activeOrders);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleClaim = async (orderId) => {
        setClaimingId(orderId);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/claim`, { method: "PATCH" });
            if (res.ok) await fetchOrders();
        } catch (err) {
            console.error("Error claiming order:", err);
        } finally {
            setClaimingId(null);
        }
    };

    const confirmComplete = (orderId) => setConfirmDialog({ open: true, orderId });

    const handleComplete = async () => {
        const orderId = confirmDialog.orderId;
        setCompletingId(orderId);
        setConfirmDialog({ open: false, orderId: null });

        try {
            const res = await fetch(`/api/admin/orders/${orderId}/complete`, { method: "PATCH" });
            if (res.ok) await fetchOrders();
        } catch (err) {
            console.error("Error completing order:", err);
        } finally {
            setCompletingId(null);
        }
    };

    if (loading) {
        return <Box sx={{ mt: 8, textAlign: "center" }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" fontWeight={700} color="#4e342e" mb={4}>
                🎫 Order Tickets
            </Typography>

            <AnimatePresence>
                {orders.length === 0 ? (
                    <Typography>No active tickets.</Typography>
                ) : (
                    orders.map((order) => {
                        const isPending = order.status === "PENDING";
                        const isInProgress = order.status === "IN_PROGRESS";
                        const color = isPending ? "#9e9e9e" : "#4caf50";
                        const bgColor = isPending ? "#f5f5f5" : "#e8f5e9";

                        return (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Paper
                                    sx={{ mb: 3, p: 3, background: bgColor, borderLeft: `6px solid ${color}`, borderRadius: 2, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                        <Box>
                                            <Typography fontWeight={700}>Order #{order.id.slice(0, 8)}...</Typography>
                                            <Typography fontSize="0.9rem" color="text.secondary">{order.user?.email || "Unknown Customer"}</Typography>
                                            <Typography fontSize="0.85rem" color="text.secondary">{new Date(order.createdAt).toLocaleTimeString()}</Typography>
                                        </Box>

                                        <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 1 }}>
                                            <Chip label={order.status.replace("_", " ")} color={isPending ? "default" : "success"} />
                                            {isPending && (
                                                <Button size="small" variant="contained" onClick={() => handleClaim(order.id)} disabled={claimingId === order.id} sx={{ backgroundColor: "#4caf50", color: "#fff", "&:hover": { backgroundColor: "#388e3c" } }}>
                                                    {claimingId === order.id ? "Claiming..." : "Claim"}
                                                </Button>
                                            )}
                                            {isInProgress && (
                                                <Button size="small" variant="outlined" onClick={() => confirmComplete(order.id)} disabled={completingId === order.id} sx={{ color: "#2e7d32", borderColor: "#2e7d32", "&:hover": { backgroundColor: "#e8f5e9", borderColor: "#1b5e20" } }}>
                                                    {completingId === order.id ? "Completing..." : "Complete"}
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 1.5 }} />
                                    {Array.isArray(order.items) && order.items.length > 0 && (
                                        <Box sx={{ pl: 1 }}>
                                            {order.items.map((item, index) => (
                                                <Box key={index} sx={{ mb: 1 }}>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {item.quantity}× {item.name} ({SIZE_MAP[item.customization?.size] || item.customization?.size || "Default"})
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">Milk: {item.customization?.milk || "Default"}</Typography>
                                                    {item.customization?.syrups && <Typography variant="body2" color="text.secondary">Syrups: {item.customization.syrups.join(", ")}</Typography>}
                                                    {item.customization?.sauces && <Typography variant="body2" color="text.secondary">Sauces: {item.customization.sauces.join(", ")}</Typography>}
                                                    {item.customization?.extras && <Typography variant="body2" color="text.secondary">Extras: {item.customization.extras.join(", ")}</Typography>}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 1.5 }} />
                                    <Typography fontWeight={600}>Total: ${order.total.toFixed(2)}</Typography>
                                </Paper>
                            </motion.div>
                        );
                    })
                )}
            </AnimatePresence>

            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, orderId: null })}>
                <DialogTitle>Complete Order</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to mark this order as <strong>Completed</strong>?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ open: false, orderId: null })}>Cancel</Button>
                    <Button variant="contained" onClick={handleComplete} sx={{ backgroundColor: "#4caf50", color: "white", "&:hover": { backgroundColor: "#388e3c" } }}>Yes, Complete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
