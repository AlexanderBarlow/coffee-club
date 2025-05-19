"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  LinearProgress,
  Button,
  Stack,
  useMediaQuery,
  Container,
  Rating,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { motion } from "framer-motion";

const tierThresholds = {
  BRONZE: { max: 200, next: "SILVER" },
  SILVER: { max: 400, next: "GOLD" },
  GOLD: { max: 600, next: "VIP" },
  VIP: { max: 1000, next: null },
};

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [featuredDrinks, setFeaturedDrinks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "snap",
    slides: { perView: 1.2, spacing: 16 },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 2.25, spacing: 20 } },
      "(min-width: 1024px)": { slides: { perView: 3, spacing: 24 } },
    },
  });

  useEffect(() => {
    const fetchAll = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return router.push("/login");

      const [userRes, ordersRes, drinksRes, reviewsRes] = await Promise.all([
        fetch(`/api/user/${session.user.id}`),
        fetch(`/api/user/${session.user.id}/orders`),
        fetch("/api/drinks/featured"),
        fetch(`/api/user/${session.user.id}/reviews`),
      ]);

      const [userData, orderData, drinkData, reviewData] = await Promise.all([
        userRes.json(),
        ordersRes.json(),
        drinksRes.json(),
        reviewsRes.json(),
      ]);

      setUserData(userData);
      setOrders(orderData);
      setFeaturedDrinks(drinkData);
      setReviews(reviewData);
      setLoading(false);
    };
    fetchAll();
  }, [router]);

  const { tier, points, email } = userData || {};
  const current = tierThresholds[tier] || {};
  const progress = current.max ? Math.min((points / current.max) * 100, 100) : 0;

  return (
    <Box sx={{ backgroundColor: "#fdf8f4", minHeight: "100vh", pb: 12 }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Profile Header */}
          <Paper elevation={4} sx={{ borderRadius: 4, p: 3, display: "flex", alignItems: "center", gap: 2, flexDirection: isMobile ? "column" : "row", textAlign: isMobile ? "center" : "left" }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: "#6f4e37" }}>@</Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>@{email?.split("@")[0]}</Typography>
              <Typography variant="caption" fontWeight={600} sx={{ backgroundColor: tier === "VIP" ? "#FFD700" : "#e6d3c0", px: 2, py: 0.5, borderRadius: 99, mt: 0.5, display: "inline-block" }}>{tier}</Typography>
            </Box>
            <Box flexGrow={1} />
            <Button variant="outlined" onClick={() => router.push("/settings")}>Edit Profile</Button>
          </Paper>

          {/* Rewards Progress */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={600}>Progress to {current.next ?? "maintaining VIP"}</Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, my: 1 }} />
            <Typography variant="body2">{points} / {current.max} points</Typography>
            <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={() => router.push("/rewards")}>View Rewards</Button>
          </Paper>

          {/* Quick Actions */}
          <Stack direction={isMobile ? "column" : "row"} spacing={2}>
            <Button fullWidth variant="contained" onClick={() => router.push("/menu")}>Start New Order</Button>
            <Button fullWidth variant="outlined" onClick={() => router.push("/favorites")}>Favorites</Button>
            {orders[0] && (
              <Button fullWidth variant="outlined" onClick={() => router.push(`/orders/${orders[0].id}`)}>Reorder Last</Button>
            )}
          </Stack>

          {/* Orders */}
          <Box>
            <Typography variant="h6" fontWeight={700} mb={1}>🧾 Recent Orders</Typography>
            {orders.length === 0 ? <Typography>No orders yet.</Typography> : orders.slice(0, 3).map((order) => (
              <Paper key={order.id} sx={{ p: 2, mb: 2, cursor: "pointer" }} onClick={() => router.push(`/orders/${order.id}`)}>
                <Typography fontWeight={600}>{new Date(order.createdAt).toLocaleDateString()}</Typography>
                {order.items.map((item, idx) => (
                  <Typography key={idx}>{item.name} - ${item.price}</Typography>
                ))}
                <Typography>Total: ${order.total}</Typography>
              </Paper>
            ))}
            <Button fullWidth onClick={() => router.push("/orders")}>View All Orders</Button>
          </Box>

          {/* Featured Drinks */}
          <Box>
            <Typography variant="h6" fontWeight={700} mb={1}>🌟 Featured Drinks</Typography>
            <Box className="keen-slider" ref={sliderRef}>
              {featuredDrinks.map((drink) => (
                <Box key={drink.id} className="keen-slider__slide" sx={{ px: 1, minWidth: 240, maxWidth: 260 }}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Image src={drink.imageUrl || "/images/fallback.jpg"} alt={drink.name} width={160} height={160} style={{ borderRadius: 8 }} />
                    <Typography fontWeight={600}>{drink.name}</Typography>
                    <Typography variant="body2" color="text.secondary">${drink.price.toFixed(2)}</Typography>
                    <Button size="small" onClick={() => router.push(`/customize/${drink.id}`)}>Order</Button>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Reviews */}
          <Box>
            <Typography variant="h6" fontWeight={700} mb={1}>💬 Your Reviews</Typography>
            {reviews.length === 0 ? <Typography>No reviews yet.</Typography> : reviews.slice(0, 2).map((review) => (
              <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
                <Typography fontWeight={600}>Order #{review.orderId.slice(0, 8)}</Typography>
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="body2" fontStyle="italic">"{review.comment}"</Typography>
              </Paper>
            ))}
            <Button fullWidth onClick={() => router.push("/reviews")}>View All Reviews</Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
