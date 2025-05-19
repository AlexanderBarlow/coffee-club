"use client";

import { Box, Typography, Paper, Avatar } from "@mui/material";
import { useRouter } from "next/navigation";

export default function RecentOrders({ orders }) {
    const router = useRouter();

    if (!orders || orders.length === 0) {
        return <Typography>No recent orders yet.</Typography>;
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
                🧾 Recent Orders
            </Typography>
            {orders.slice(0, 3).map((order) => (
                <Paper
                    key={order.id}
                    onClick={() => router.push(`/orders/${order.id}`)}
                    sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    }}
                >
                    <Typography fontWeight={600}>
                        {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    {order.items.map((item, idx) => (
                        <Box
                            key={idx}
                            sx={{ display: "flex", alignItems: "center", gap: 2, my: 1 }}
                        >
                            <Avatar
                                src={item.imageUrl || "/images/fallback.jpg"}
                                alt={item.name}
                                sx={{ width: 48, height: 48 }}
                            />
                            <Box>
                                <Typography fontWeight={500}>{item.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {item.customization?.size} • {item.customization?.milk}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                    <Typography fontWeight={600}>Total: ${order.total}</Typography>
                </Paper>
            ))}
        </Box>
    );
} 
