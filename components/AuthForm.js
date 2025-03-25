// components/AuthForm.js
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log("Supabase Client:", supabase);
    console.log("Supabase Auth:", supabase.auth);


    const fn =
      type === "signup"
        ? supabase.auth.signUp
        : supabase.auth.signInWithPassword;
    const { data, error } = await fn({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
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
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}
