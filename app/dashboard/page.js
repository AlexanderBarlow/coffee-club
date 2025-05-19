"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Box, CircularProgress, Typography, Button, Grid } from "@mui/material";
import BottomTabBar from "@/components/MobileNavbar";
import { motion } from "framer-motion";

// Components
import UserProfileCard from "@/components/UserProfileCard";
import PointsProgressBar from "@/components/PointsProgressBar";
import RecentOrders from "@/components/RecentOrders";
import FeaturedDrinksCarousel from "@/components/FeaturedDrinksCarousel";
import UserReviews from "@/components/UserReviews";
import UserHeader from "@/components/UserHeader";

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [featuredDrinks, setFeaturedDrinks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const { email, tier, points } = userData;
  const username = email.split("@")[0];

  return (
    <Box sx={{ backgroundColor: "#fdf8f4", minHeight: "100vh", pb: 12 }}>
      <BottomTabBar />

      <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <UserProfileCard email={email} tier={tier} />
            </Grid>
            <Grid item xs={12} md={6}>
              <PointsProgressBar tier={tier} points={points} />
            </Grid>
          </Grid>

          <Box mb={4}>
            <Typography
              variant="h6"
              fontWeight={700}
              mb={1}
              sx={{ color: "#3e3028" }}
            >
              🎁 Perks of being {tier}
            </Typography>
            <ul
              style={{
                paddingLeft: "1.2rem",
                color: "#5a4a3c",
                lineHeight: 1.6,
              }}
            >
              <li>Free drink after 5 orders</li>
              <li>10% off on featured drinks</li>
              <li>Early access to seasonal specials</li>
            </ul>
          </Box>

          <Box mb={5}>
            <Typography
              variant="h6"
              fontWeight={700}
              mb={2}
              sx={{ color: "#3e3028" }}
            >
              🧾 Your Recent Orders
            </Typography>
            <RecentOrders orders={orders} />
          </Box>

          <Box mb={5}>
            <Typography
              variant="h6"
              fontWeight={700}
              mb={2}
              sx={{ color: "#3e3028" }}
            >
              🌟 Featured Drinks
            </Typography>
            <FeaturedDrinksCarousel featuredDrinks={featuredDrinks} />
          </Box>

          <Box mb={5}>
            <Typography
              variant="h6"
              fontWeight={700}
              mb={2}
              sx={{ color: "#3e3028" }}
            >
              💬 Your Reviews
            </Typography>
            <UserReviews reviews={reviews} />
          </Box>

          <Box textAlign="center">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#6f4e37",
                borderRadius: 99,
                px: 4,
                py: 1.25,
              }}
              onClick={() => router.push("/menu")}
            >
              ☕ Order your next favorite
            </Button>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
