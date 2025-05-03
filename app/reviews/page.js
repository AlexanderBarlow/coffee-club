"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Container,
    Button,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import ResponsiveNavbar from "@/components/MobileNavbar";

export default function ReviewListPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchReviews = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch(`/api/user/${session.user.id}/orders`);
                const data = await res.json();
                const eligibleOrders = data.filter(
                    (order) => order.status === "COMPLETED" && !order.review
                );
                setOrders(eligibleOrders);
            } catch (err) {
                console.error("Error loading reviews", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [router]);

    if (loading) {
        return (
            <Box sx={{ mt: 10, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <ResponsiveNavbar />
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Typography variant="h4" fontWeight={700} color="#6f4e37" mb={4}>
                Leave a Review
            </Typography>

            {orders.length === 0 ? (
                <Typography>No orders to review yet!</Typography>
            ) : (
                orders.map((order) => (
                    <Paper
                        key={order.id}
                        sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: 3,
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Typography fontWeight={600} mb={1}>
                            Order #{order.id.slice(0, 8)}
                        </Typography>
                        <Typography mb={2}>
                            Placed on: {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#6f4e37",
                                "&:hover": { backgroundColor: "#5a3c2c" },
                            }}
                            onClick={() => router.push(`/orders/${order.id}/review`)}
                        >
                            Leave Review
                        </Button>
                    </Paper>
                ))
            )}
            </Container>
            </>
    );
}
