"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
	Box,
	Typography,
	Paper,
	LinearProgress,
	Avatar,
	Skeleton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import BottomTabBar from "@/components/MobileNavbar";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import { motion } from "framer-motion";
import "keen-slider/keen-slider.min.css";

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
		const fetchAll = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) return router.push("/login");

			const [userRes, ordersRes, drinksRes] = await Promise.all([
				fetch(`/api/user/${session.user.id}`),
				fetch(`/api/user/${session.user.id}/orders`),
				fetch("/api/drinks/featured"),
			]);

			const userData = await userRes.json();
			const ordersData = await ordersRes.json();
			const drinksData = await drinksRes.json();

			setUserData(userData);
			setOrders(Array.isArray(ordersData) ? ordersData : []);
			setFeaturedDrinks(drinksData);
			setLoading(false);
		};

		fetchAll();
	}, [router]);

	const { tier, points, email } = userData || {};
	const current = tierThresholds[tier] || {};
	const progress = current.max
		? Math.min((points / current.max) * 100, 100)
		: 0;

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
					backgroundColor: "#fdf8f4",
					color: "#3e3028",
				}}
			>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Paper
						elevation={4}
						sx={{
							borderRadius: 4,
							p: 3,
							display: "flex",
							alignItems: "center",
							gap: 2,
							backgroundColor: "#ffffff",
							mb: 3,
						}}
					>
						<Avatar sx={{ width: 56, height: 56, bgcolor: "#6f4e37" }}>
							@
						</Avatar>
						<Box flex={1}>
							<Typography variant="h6" fontWeight={700}>
								@{email?.split("@")[0] || <Skeleton width={80} />}
							</Typography>
							<Typography
								variant="caption"
								fontWeight={600}
								sx={{
									backgroundColor: tier === "VIP" ? "#FFD700" : "#e6d3c0",
									px: 2,
									py: 0.5,
									borderRadius: 99,
									mt: 0.5,
									display: "inline-block",
								}}
							>
								{tier || <Skeleton width={40} />}
							</Typography>
						</Box>
					</Paper>
				</motion.div>

				{/* Progress */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Box sx={{ mb: 4 }}>
						<Typography fontWeight={500}>
							{points} / {current.max} points to {current.next ?? "stay VIP"}
						</Typography>
						<LinearProgress
							variant="determinate"
							value={progress}
							sx={{ height: 10, borderRadius: 5, mt: 1 }}
						/>
					</Box>
				</motion.div>

				{/* Real Orders */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
				>
					<Box>
						<Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
							Recent Orders
						</Typography>
						{orders.slice(0, 3).map((order) => (
							<Paper
								key={order.id}
								sx={{
									mb: 2,
									p: 2,
									borderRadius: 3,
									backgroundColor: "#fff",
									boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
								}}
							>
								<Typography fontWeight={600}>
									🧾 Order on {new Date(order.createdAt).toLocaleDateString()}
								</Typography>
								{order.items.map((item, idx) => (
									<Box
										key={idx}
										sx={{
											display: "flex",
											alignItems: "center",
											mb: 1.5,
											gap: 2,
										}}
									>
										<Avatar
											src={item.imageUrl}
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
				</motion.div>
				{/* Featured Drinks */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Box sx={{ mt: 6 }}>
						<Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
							🌟 Featured Drinks
						</Typography>
						<Box ref={sliderRef} className="keen-slider">
							{featuredDrinks.length === 0
								? [...Array(3)].map((_, i) => (
										<Box
											key={i}
											className="keen-slider__slide"
											sx={{ px: 1, minWidth: 220, maxWidth: 250 }}
										>
											<Skeleton
												variant="rectangular"
												width={220}
												height={180}
												sx={{ borderRadius: 2 }}
											/>
											<Skeleton width="80%" height={20} sx={{ mt: 1 }} />
											<Skeleton width="60%" height={16} />
										</Box>
								  ))
								: featuredDrinks.map((drink) => (
										<Box
											key={drink.id}
											className="keen-slider__slide"
											sx={{
												px: 1,
												minWidth: 220,
												maxWidth: 250,
												display: "flex",
												justifyContent: "center",
											}}
										>
											<motion.div whileHover={{ scale: 1.03 }}>
												<Paper
													elevation={3}
													sx={{
														p: 2,
														borderRadius: 3,
														backgroundColor: "#fff",
														height: "100%",
														display: "flex",
														flexDirection: "column",
														alignItems: "center",
														textAlign: "center",
													}}
												>
													<Image
														src={drink.imageUrl || "/images/fallback.jpg"}
														alt={drink.name}
														width={160}
														height={160}
														style={{
															borderRadius: 12,
															objectFit: "cover",
														}}
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
														sx={{ mt: 0.5, color: "#5a4a3c" }}
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
											</motion.div>
										</Box>
								  ))}
						</Box>
					</Box>
				</motion.div>
			</Box>
		</>
	);
}
