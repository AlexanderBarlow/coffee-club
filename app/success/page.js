"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Paper,
	Divider,
	CircularProgress,
	Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function SuccessPage() {
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const { width, height } = useWindowSize(); // for confetti sizing

	useEffect(() => {
		const fetchLatestOrder = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) return router.push("/login");

			try {
				const res = await fetch(`/api/user/${session.user.id}/orders/latest`);
				const data = await res.json();
				setOrder(data);
			} catch (err) {
				console.error("❌ Failed to fetch latest order:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchLatestOrder();
	}, [router]);

	if (loading) {
		return (
			<Box sx={{ mt: 10, textAlign: "center" }}>
				<CircularProgress />
			</Box>
		);
	}

	if (!order) {
		return (
			<Typography sx={{ mt: 10, textAlign: "center", color: "black" }}>
				No order found.
			</Typography>
		);
	}

	return (
		<Box
			sx={{
				maxWidth: 700,
				mx: "auto",
				p: 3,
				color: "black",
				position: "relative",
			}}
		>
			<Confetti
				width={width}
				height={height}
				recycle={false}
				numberOfPieces={300}
			/>

			<Typography
				variant="h4"
				fontWeight={700}
				gutterBottom
				sx={{ color: "black" }}
			>
				🎉 Order Confirmed!
			</Typography>
			<Typography variant="body1" sx={{ mb: 3, color: "black" }}>
				Thank you for your order placed on{" "}
				<strong>{new Date(order.createdAt).toLocaleString()}</strong>
			</Typography>

			<Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
				{order.items.map((item, idx) => (
					<Box key={idx} sx={{ mb: 2 }}>
						<Typography variant="h6" sx={{ color: "black" }}>
							{item.name}
						</Typography>
						<Typography variant="body2" sx={{ color: "black" }}>
							Size: {item.customization?.size} • Milk:{" "}
							{item.customization?.milk}
						</Typography>
						<Typography variant="body2" sx={{ color: "black" }}>
							Syrup: {item.customization?.syrup || "None"} • Sauce:{" "}
							{item.customization?.sauce || "None"} • Extra Shots:{" "}
							{item.customization?.extraShots || 0}
						</Typography>
						{item.customization?.notes && (
							<Typography variant="body2" sx={{ color: "black" }}>
								Notes: {item.customization.notes}
							</Typography>
						)}
						<Typography fontWeight={600} sx={{ mt: 1, color: "black" }}>
							${item.price.toFixed(2)}
						</Typography>
						<Divider sx={{ my: 2 }} />
					</Box>
				))}

				<Typography variant="h6" fontWeight={700} sx={{ color: "black" }}>
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
