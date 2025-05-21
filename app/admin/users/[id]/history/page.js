"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
    Box,
    CircularProgress,
    Typography,
    Paper,
    Divider,
    Button,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams } from "next/navigation";

export default function AdminUserOrdersPage({ params }) {
    const { id } = useParams();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`/api/user/${id}/orders`);
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch user orders", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [id]);

    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 3, color: "#6f4e37" }}
                onClick={() => router.back()}
            >
                Back to Users
            </Button>

            <Typography variant="h5" fontWeight={700} mb={4}>
                📦 Order History
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : orders.length === 0 ? (
                <Typography>No orders found for this user.</Typography>
            ) : (
                orders.map((order) => (
                    <Paper key={order.id} sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={3}>
                        <Typography fontWeight={700}>
                            Order #{order.id.slice(0, 8)} — {new Date(order.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total: ${order.total.toFixed(2)} — Status: {order.status}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {order.items.map((item, idx) => (
                            <Box key={idx} sx={{ mb: 1 }}>
                                <Typography fontWeight={600}>{item.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.customization?.size}, {item.customization?.milk}, Syrup: {item.customization?.syrup || "None"}, Sauce: {item.customization?.sauce || "None"}, Shots: {item.customization?.extraShots || 0}
                                </Typography>
                            </Box>
                        ))}

                        {order.review ? (
                            <Box mt={2}>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="subtitle2" fontWeight={600}>Review:</Typography>
                                <Typography variant="body2" fontStyle="italic">“{order.review.comment}”</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Rating: {order.review.rating}★
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary" mt={2}>
                                No review left for this order.
                            </Typography>
                        )}
                    </Paper>
                ))
            )}
        </Box>
    );
}
