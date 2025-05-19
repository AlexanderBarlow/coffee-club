"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";

export default function AdminVerifyPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [employeeNumber, setEmployeeNumber] = useState("");
  const [storeNumber, setStoreNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("You must be logged in to verify.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/staff/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ employeeNumber, storeNumber }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Verification failed.");
        setLoading(false);
        return;
      }

      // Save flag and redirect based on role
      localStorage.setItem("staff_verified", "true");

      setTimeout(() => {
        if (result.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push(`/dashboard/${result.role.toLowerCase()}`);
        }
      }, 1000);
    } catch (err) {
      console.error("❌ Verification error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        backgroundColor: "#fdf8f4",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} color="#6f4e37" textAlign="center" mb={3}>
          Admin Verification
        </Typography>

        <form onSubmit={handleVerify}>
          <TextField
            label="Employee Number"
            fullWidth
            required
            margin="normal"
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
          />
          <TextField
            label="Store Number"
            fullWidth
            required
            margin="normal"
            value={storeNumber}
            onChange={(e) => setStoreNumber(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              backgroundColor: "#6f4e37",
              "&:hover": { backgroundColor: "#5b3e2f" },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Verify & Continue"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
