"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Chip,
  Paper,
  Avatar,
} from "@mui/material";
import dynamic from "next/dynamic";
import ResponsiveNavbar from "@/components/MobileNavbar";

const MapClientOnly = dynamic(() => import("@/components/MapClientOnly"), {
  ssr: false,
});

export default function OrderDetailsPage() {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          Order not found.
        </Typography>
      </Box>
    );
  }

  const { id, status, total, createdAt, items, user } = order;

  return (
    <>
      <ResponsiveNavbar />
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          px: 2,
          pt: 4,
          pb: 10,
        }}
      >
        {/* Order Heading */}
        <Typography variant="h4" fontWeight={700} color="#6f4e37" mb={3}>
          Order #{id?.slice(0, 8) || "N/A"}
        </Typography>

        {/* Order Summary Card */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 3,
            backgroundColor: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight={600}>
              Status:
            </Typography>
            <Chip
              label={status}
              color={
                status === "COMPLETED"
                  ? "success"
                  : status === "CANCELLED"
                  ? "error"
                  : "warning"
              }
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>

          <Typography fontSize="0.95rem" mb={0.5}>
            <b>Customer:</b> {user?.email || "Unknown"}
          </Typography>
          <Typography fontSize="0.95rem" mb={0.5}>
            <b>Placed:</b> {new Date(createdAt).toLocaleString()}
          </Typography>
          <Typography fontSize="0.95rem">
            <b>Total:</b> ${total.toFixed(2)}
          </Typography>
        </Paper>

        {/* Items */}
        <Typography variant="h6" fontWeight={700} mb={2} color="#6f4e37">
          Order Items
        </Typography>

        {items.map((item, i) => (
          <Paper
            key={i}
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 2,
              backgroundColor: "#fefefe",
            }}
          >
            <Avatar
              src={item.imageUrl || "/images/fallback.jpg"}
              alt={item.name}
              sx={{ width: 56, height: 56 }}
            />
            <Box>
              <Typography fontWeight={600}>{item.name}</Typography>
              {item.customization && (
                <Typography variant="caption" color="text.secondary">
                  {Object.entries(item.customization)
                    .map(([key, val]) => `${key}: ${val}`)
                    .join(" • ")}
                </Typography>
              )}
            </Box>
          </Paper>
        ))}

        {/* Hardcoded Map Location */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" fontWeight={700} mb={2} color="#6f4e37">
            Pickup Location
          </Typography>
          <Paper
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <MapClientOnly lat={37.7749} lng={-122.4194} />{" "}
            {/* San Francisco */}
          </Paper>
        </Box>
      </Box>
    </>
  );
}
