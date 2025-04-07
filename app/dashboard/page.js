"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Box, Typography, Paper, LinearProgress, Button } from "@mui/material";
import { motion } from "framer-motion";
import BottomTabBar from "@/components/MobileNavbar";
import Image from "next/image";

const tierThresholds = {
	BRONZE: { max: 200, next: "SILVER" },
	SILVER: { max: 400, next: "GOLD" },
	GOLD: { max: 600, next: "VIP" },
	VIP: { max: 1000, next: null },
};

export default function DashboardPage() {
	const [userData, setUserData] = useState(null);
	const [featuredDrink, setFeaturedDrink] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	// Fetch featured drink
	useEffect(() => {
		const fetchFeatured = async () => {
			try {
				const res = await fetch("/api/drinks/featured");
				const data = await res.json();
				if (!data.error) {
					setFeaturedDrink(data);
				}
				console.log("☕ Featured Drink:", data);
			} catch (err) {
				console.error("❌ Error fetching featured drink:", err);
			}
		};

		fetchFeatured();
	}, []);

	// Fetch authenticated user + their info from DB
	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				router.push("/login");
				return;
			}

			const res = await fetch(`/api/user/${session.user.id}`);
			const result = await res.json();

			if (result.error) {
				console.error(result.error);
			} else {
				setUserData(result);
			}

			setLoading(false);
		};

		fetchUser();
	}, [router]);

	if (loading || !userData) {
		return (
			<Typography sx={{ mt: 10, textAlign: "center" }}>Loading...</Typography>
		);
	}

	const { tier, points } = userData;
	const current = tierThresholds[tier];
	const progress = Math.min((points / current.max) * 100, 100);

	return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2, paddingBottom: 10 }}>
      <BottomTabBar />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* User Greeting & Rewards */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Welcome back 👋
          </Typography>
          <Typography variant="body1">
            <strong>Tier:</strong> {tier}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Points:</strong> {points} / {current.max}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 10, borderRadius: 5, mt: 2 }}
          />
          {current.next && (
            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
              {current.max - points} points to reach{" "}
              <strong>{current.next}</strong> tier!
            </Typography>
          )}
        </Paper>

        {/* Daily Inspiration */}
        <Paper
          elevation={1}
          sx={{
            mt: 3,
            mb: 3,
            p: 3,
            borderRadius: 4,
            background: "#fff8f0",
            textAlign: "center",
          }}
        >
          <Typography fontWeight={600} sx={{ fontSize: "1.1rem" }}>
            ☕ “Start your day with a sip of joy.”
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Your coffee journey continues...
          </Typography>
        </Paper>

        {/* Featured Drink Section */}
        {featuredDrink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={3}
              sx={{
                mt: 3,
                mb: 3,
                borderRadius: 4,
                overflow: "hidden",
                background: "#ffffff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                textAlign: "center",
                px: 2,
                py: 3,
              }}
            >
              <Image
                src={featuredDrink.imageUrl}
                alt={featuredDrink.name}
                width={180}
                height={180}
                style={{
                  borderRadius: "12px",
                  objectFit: "cover",
                  margin: "0 auto",
                }}
              />

              <Typography
                variant="overline"
                sx={{
                  color: "#6f4e37",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  mt: 2,
                }}
              >
                🌟 Drink of the Month
              </Typography>

              <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>
                {featuredDrink.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {featuredDrink.description}
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mt: 1.5, color: "#333" }}
              >
                ${featuredDrink.price.toFixed(2)}
              </Typography>
            </Paper>
          </motion.div>
        )}

        {/* Upcoming Tier Reward */}
        {current.next && (
          <Paper
            elevation={1}
            sx={{
              mt: 4,
              p: 3,
              textAlign: "center",
              borderRadius: 4,
              background: "#f5f5f5",
            }}
          >
            <Typography variant="body2">
              You're <strong>{current.max - points} points</strong> away from
              reaching <strong>{current.next}</strong> tier 🎯
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Unlock new perks and rewards!
            </Typography>
          </Paper>
        )}

        {/* Sign Out */}
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 5, textTransform: "none" }}
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
        >
          Sign Out
        </Button>
      </motion.div>
    </Box>
  );
}
