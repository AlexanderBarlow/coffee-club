"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import BottomTabBar from "@/components/MobileNavbar";


// Mocked tier levels (you can move this into DB later)
const tierThresholds = {
  BRONZE: { max: 200, next: "SILVER" },
  SILVER: { max: 400, next: "GOLD" },
  GOLD: { max: 600, next: "VIP" },
  VIP: { max: 1000, next: null },
};

const menuCategories = [
  { title: "Iced Coffees", emoji: "🧊", link: "/icedcoffee" },
  { title: "Hot Coffees", emoji: "☕", link: "/hotcoffee" },
  { title: "Espresso", emoji: "⚡", link: "/espresso" },
  { title: "Frappes", emoji: "🍧", link: "/frappes" },
  { title: "Tea", emoji: "🍵", link: "/tea" },
  { title: "Grub", emoji: "⚡", link: "/grub" },
];

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
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

				<Typography variant="h6" fontWeight={500} gutterBottom>
					☕ Explore the Menu
				</Typography>

				<Grid container spacing={2}>
					{menuCategories.map((category) => (
						<Grid item xs={6} sm={4} key={category.title}>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.97 }}
							>
								<Card
									sx={{
										textAlign: "center",
										borderRadius: 3,
										p: 2,
										cursor: "pointer",
										minHeight: 100,
									}}
									elevation={2}
									onClick={() => router.push(category.link)} // Add this
								>
									<CardContent>
										<Typography fontSize={30}>{category.emoji}</Typography>
										<Typography fontWeight={500}>{category.title}</Typography>
									</CardContent>
								</Card>
							</motion.div>
						</Grid>
					))}
				</Grid>

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
			<BottomTabBar />
		</Box>
	);
}
