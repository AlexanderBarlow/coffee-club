"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Paper, LinearProgress } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import BottomTabBar from "@/components/MobileNavbar";
import { supabase } from "@/lib/supabaseClient";

const tierThresholds = {
	BRONZE: { max: 200, next: "SILVER" },
	SILVER: { max: 400, next: "GOLD" },
	GOLD: { max: 600, next: "VIP" },
	VIP: { max: 1000, next: null },
};

export default function RewardsPage() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setUser(session?.user || null);
			setLoading(false);
		};
		getSession();
	}, []);

	const tier = user?.user_metadata?.tier || "BRONZE";
	const points = user?.user_metadata?.points || 0;
	const current = tierThresholds[tier] || {};
	const progress = current.max
		? Math.min((points / current.max) * 100, 100)
		: 100;

	return (
		<main className="min-h-screen bg-[#fffaf7] text-[#3e3028] px-4 pb-24">
			<BottomTabBar />
			<Box sx={{ maxWidth: 600, mx: "auto", py: 6 }}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
						🏅 Your Rewards
					</Typography>

					<Paper
						elevation={3}
						sx={{
							p: 3,
							borderRadius: 3,
							backgroundColor: "#fff8f2",
							mb: 4,
						}}
					>
						<Typography variant="h6" fontWeight={600}>
							Tier: {tier}
						</Typography>
						<Typography variant="body2" sx={{ mb: 1 }}>
							{points} / {current.max} points to {current.next ?? "stay VIP"}
						</Typography>
						<LinearProgress
							variant="determinate"
							value={progress}
							sx={{ height: 10, borderRadius: 5 }}
						/>
					</Paper>

					<Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
						🎁 Your Perks
					</Typography>
					<div className="grid sm:grid-cols-2 gap-4">
						{[
							"Free Birthday Drink",
							"Priority Access to New Blends",
							"10% Off Merch",
							"Double Points Fridays",
						].map((perk, idx) => (
							<motion.div
								key={idx}
								whileHover={{ scale: 1.03 }}
								className="bg-white p-4 rounded-xl shadow-sm border border-[#f1e9e2]"
							>
								<h4 className="font-semibold text-lg">{perk}</h4>
							</motion.div>
						))}
					</div>
				</motion.div>
			</Box>
		</main>
	);
}
