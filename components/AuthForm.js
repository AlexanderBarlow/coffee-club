// components/AuthForm.js
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Box } from "@mui/material";

export default function AuthForm({ type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, px: 2 }}>
      <Typography variant="h5" gutterBottom>
        {type === "signup" ? "Create Account" : "Log In"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          margin="normal"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          {type === "signup" ? "Sign Up" : "Log In"}
        </Button>
      </form>
    </Box>
  );
}
