"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";
import { useCart } from "@/context/CartContext";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setCart } = useCart();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/by-session/${sessionId}`);
        const data = await res.json();
        setOrder(data);
        localStorage.removeItem("cart");
        setCart([]);
      } catch (err) {
        console.error("❌ Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchOrder();
  }, [sessionId, setCart]);

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Typography sx={{ mt: 10, textAlign: "center" }}>
        No order found.
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        🎉 Order Confirmed!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Thank you for your order placed on{" "}
        <strong>{new Date(order.createdAt).toLocaleString()}</strong>
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {order.items.map((item, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body2">
              Size: {item.customization?.size} • Milk:{" "}
              {item.customization?.milk}
            </Typography>
            <Typography variant="body2">
              Syrup: {item.customization?.syrup || "None"} • Sauce:{" "}
              {item.customization?.sauce || "None"} • Extra Shots:{" "}
              {item.customization?.extraShots || 0}
            </Typography>
            {item.customization?.notes && (
              <Typography variant="body2">
                Notes: {item.customization.notes}
              </Typography>
            )}
            <Typography fontWeight={600} sx={{ mt: 1 }}>
              ${item.price.toFixed(2)}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
        ))}

        <Typography variant="h6" fontWeight={700}>
          Total: ${order.total.toFixed(2)}
        </Typography>
      </Paper>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 4 }}
        onClick={() => router.push("/dashboard")}
      >
        Return to Dashboard
      </Button>
    </Box>
  );
}
