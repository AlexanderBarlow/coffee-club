"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
	TextField,
	Button,
	Typography,
	Box,
	Paper,
	Divider,
	InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import CoffeeIcon from "@mui/icons-material/LocalCafe";

export default function AuthForm({ type }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const createUserIfNotExists = async (id, email) => {
		try {
			await fetch("/api/user/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, email }),
			});
		} catch (err) {
			console.error("❌ Failed to sync user with DB:", err);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			if (type === "signup") {
				await supabase.auth.signOut(); // clear any lingering session
				const { data, error } = await supabase.auth.signUp({ email, password });

				if (error) {
					setError(error.message);
					return;
				}

				router.push("/verify"); // Wait for email confirmation
				return;
			}

			// LOGIN
			const { data: authData, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				setError(error.message);
				return;
			}

			const userId = authData.user?.id;
			const userEmail = authData.user?.email;

			await createUserIfNotExists(userId, userEmail);

			// Check if user is an admin
			const res = await fetch(`/api/user/${userId}`);
			const user = await res.json();

			if (user?.isAdmin) {
				router.push("/admin");
			} else {
				router.push("/dashboard");
			}
		} catch (err) {
			console.error("Unexpected error:", err);
			setError("Something went wrong. Please try again.");
		}
	};

	return (
		<Box sx={{ maxWidth: 400, mx: "auto", mt: 10, px: 2 }}>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<Paper elevation={6} sx={{ borderRadius: 4, p: 4 }}>
					<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
						<CoffeeIcon fontSize="large" color="primary" />
						<Typography variant="h5" sx={{ ml: 1, fontWeight: 600 }}>
							Coffee Club
						</Typography>
					</Box>
					<Divider sx={{ mb: 3 }} />
					<Typography variant="h6" gutterBottom>
						{type === "signup"
							? "Create your account"
							: "Log in to your account"}
					</Typography>
					<form onSubmit={handleSubmit}>
						<TextField
							fullWidth
							label="Email"
							type="email"
							required
							margin="normal"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">@</InputAdornment>
								),
							}}
						/>
						<TextField
							fullWidth
							label="Password"
							type="password"
							required
							margin="normal"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						{error && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<Typography color="error" variant="body2" sx={{ mt: 1 }}>
									{error}
								</Typography>
							</motion.div>
						)}

						<motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
							<Button
								fullWidth
								variant="contained"
								type="submit"
								sx={{
									mt: 3,
									py: 1.5,
									fontWeight: 600,
									fontSize: "1rem",
									borderRadius: "12px",
									textTransform: "none",
								}}
							>
								{type === "signup" ? "Sign Up" : "Log In"}
							</Button>
						</motion.div>

						<Box sx={{ mt: 3, textAlign: "center" }}>
							<Typography variant="body2">
								{type === "signup" ? (
									<>
										Already have an account?{" "}
										<Button
											variant="text"
											onClick={() => router.push("/login")}
										>
											Log in
										</Button>
									</>
								) : (
									<>
										Don't have an account?{" "}
										<Button
											variant="text"
											onClick={() => router.push("/signup")}
										>
											Sign up
										</Button>
									</>
								)}
							</Typography>
						</Box>
					</form>
				</Paper>
			</motion.div>
		</Box>
	);
}
