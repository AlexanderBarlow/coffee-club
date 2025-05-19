"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Box, CircularProgress } from "@mui/material";
import BottomTabBar from "@/components/MobileNavbar";
import { motion } from "framer-motion";

// Components
import UserProfileCard from "@/components/UserProfileCard"
import PointsProgressBar from "@/components/PointsProgressBar";
import RecentOrders from "@/components/RecentOrders";
import FeaturedDrinksCarousel from "@/components/FeaturedDrinksCarousel";
import UserReviews from "@/components/UserReviews";

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

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#fdf8f4", minHeight: "100vh", pb: 12 }}>
      <BottomTabBar />

      <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <UserProfileCard email={userData.email} tier={userData.tier} />
          <PointsProgressBar tier={userData.tier} points={userData.points} />
          <RecentOrders orders={orders} />
          <FeaturedDrinksCarousel featuredDrinks={featuredDrinks} />
          <UserReviews reviews={reviews} />
        </motion.div>
      </Box>
    </Box>
  );
}
