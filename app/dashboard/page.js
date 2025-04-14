"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
  Avatar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import BottomTabBar from "@/components/MobileNavbar";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const tierThresholds = {
  BRONZE: { max: 200, next: "SILVER" },
  SILVER: { max: 400, next: "GOLD" },
  GOLD: { max: 600, next: "VIP" },
  VIP: { max: 1000, next: null },
};

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [featuredDrinks, setFeaturedDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return router.push("/login");

      const res = await fetch(`/api/user/${session.user.id}`);
      const result = await res.json();
      setUserData(result);
      setLoading(false);
    };

    const fetchFeatured = async () => {
      const res = await fetch("/api/drinks/featured");
      const data = await res.json();
      setFeaturedDrinks(data);
    };

    fetchUser();
    fetchFeatured();
  }, [router]);

  if (loading || !userData)
    return (
      <Typography sx={{ mt: 10, textAlign: "center" }}>Loading...</Typography>
    );

  const { tier, points, email } = userData;
  const current = tierThresholds[tier];
  const progress = Math.min((points / current.max) * 100, 100);

  return (
    <>
      <BottomTabBar />
      <Box
        sx={{
          maxWidth: "100vw",
          minHeight: "100vh",
          mx: "auto",
          px: 2,
          py: 4,
          pb: 12,
          backgroundColor: "#fef8f2",
          color: "#3e3028",
        }}
      >
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: "#fff",
          }}
        >
          <Avatar sx={{ width: 56, height: 56, bgcolor: "#6f4e37" }}>@</Avatar>
          <Box flex={1}>
            <Typography variant="h6" fontWeight={700}>
              @{email.split("@")[0]}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{
                  backgroundColor: tier === "VIP" ? "#FFD700" : "#e6d3c0",
                  px: 2,
                  py: 0.5,
                  borderRadius: 99,
                  display: "inline-block",
                }}
              >
                {tier}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Tier Progress */}
        <Box sx={{ mt: 4 }}>
          <Typography fontWeight={500}>
            {points} / {current.max} points to {current.next ?? "stay VIP"}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              mt: 1,
              backgroundColor: "#e0d6cf",
            }}
          />
        </Box>

        {/* Recent Orders */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Recent Orders
          </Typography>
          {["Latte", "Mocha", "Cappuccino"].map((item, index) => (
            <Paper
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                px: 2,
                py: 1,
                borderRadius: 3,
                backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <Avatar sx={{ bgcolor: "#f4f4f4", color: "#6f4e37", mr: 2 }}>
                ☕
              </Avatar>
              <Box>
                <Typography fontWeight={600}>{item}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Just now
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Featured Drinks Carousel */}
        {featuredDrinks.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              🌟 Featured Drinks
            </Typography>
            <Box ref={sliderRef} className="keen-slider">
              {featuredDrinks.map((drink, idx) => (
                <Box
                  key={drink.id}
                  className="keen-slider__slide"
                  sx={{
                    px: 1,
                    minWidth: 220,
                    maxWidth: 250,
                    textAlign: "center",
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "#fff",
                      height: "100%",
                    }}
                  >
                    <Image
                      src={drink.imageUrl || "/images/fallback.jpg"}
                      alt={drink.name}
                      width={160}
                      height={160}
                      style={{ borderRadius: 12, objectFit: "cover" }}
                    />
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ mt: 1 }}
                    >
                      {drink.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ mt: 0.5, color: "#5a4a3c", display: "block" }}
                    >
                      {drink.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{ mt: 1, color: "#3e3028" }}
                    >
                      ${drink.price.toFixed(2)}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
