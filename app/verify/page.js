"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, Box, CircularProgress } from "@mui/material";
import { supabase } from "@/lib/supabaseClient";

export default function VerifyPage() {
	const router = useRouter();

	useEffect(() => {
		const interval = setInterval(async () => {
			console.log("🔄 Polling for session...");

			await supabase.auth.refreshSession();

			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session) {
				console.log("✅ Session found!", session);
				clearInterval(interval);

				const { data: userData, error } = await supabase.auth.getUser();
				const user = userData?.user;

				if (error) {
					console.error("❌ Error getting user:", error);
				}

				if (user) {
					console.log("✅ Verified user:", user);

					const res = await fetch("/api/user/create", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							id: user.id,
							email: user.email,
						}),
					});

					const result = await res.json();
					console.log("📨 DB create response:", result);

					if (res.ok) {
						router.push("/dashboard");
					} else {
						console.error("❌ Failed to create user in DB:", result.error);
					}
				}
			}
		}, 3000);

		return () => clearInterval(interval);
	}, [router]);

	return (
		<Box
			sx={{
				maxWidth: 500,
				mx: "auto",
				mt: 12,
				px: 3,
				textAlign: "center",
				color: "#6f4e37",
			}}
		>
			<Typography variant="h4" fontWeight={700} gutterBottom>
				Confirm Your Email 📬
			</Typography>

			<Typography variant="body1" sx={{ mt: 2, fontWeight: 500 }}>
				We’ve sent you an email to verify your account.
				<br />
				Once you confirm, you’ll be redirected to your dashboard.
			</Typography>

			<Box sx={{ mt: 5 }}>
				<CircularProgress sx={{ color: "#6f4e37" }} />
			</Box>
		</Box>
	);
}
