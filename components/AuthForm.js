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
        await supabase.auth.signOut();
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) return setError(error.message);
        if (data?.user) {
          await createUserIfNotExists(data.user.id, data.user.email);
        }

        return router.push("/verify");
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return setError(error.message);

      const userId = authData.user?.id;
      const res = await fetch(`/api/user/${userId}`);

      const user = await res.json();
      const role = user?.role?.name;

      if (role !== "USER") {
        // Any staff role
        router.push("/admin-verify");
      } else {
        router.push("/dashboard");
      }
      
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "start",
        justifyContent: "center",
        background: "linear-gradient(145deg, #fff9f4, #ffeede)",
        px: 2,
        pt: 10,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Paper
          elevation={12}
          sx={{
            borderRadius: 4,
            p: 4,
            backdropFilter: "blur(6px)",
            boxShadow: "0 10px 30px rgba(111, 78, 55, 0.2)",
            backgroundColor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <CoffeeIcon fontSize="large" sx={{ color: "#6f4e37" }} />
            </motion.div>
            <Typography
              variant="h5"
              sx={{
                ml: 1,
                fontWeight: 700,
                background: "linear-gradient(to right, #6f4e37, #a67c52)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
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
                  backgroundColor: "#6f4e37",
                  "&:hover": {
                    backgroundColor: "#5a3f2e",
                  },
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
                    Don’t have an account?{" "}
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
