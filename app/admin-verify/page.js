"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function AdminVerifyForm() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [storeNumber, setStoreNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        await supabase.auth.refreshSession();
        session = (await supabase.auth.getSession()).data.session;
      }

      const accessToken = session?.access_token;
      if (!accessToken) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/staff/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ employeeNumber, storeNumber }),
      });

      const data = await res.json();
      localStorage.setItem("staff_verified", "true");

      if (!res.ok) {
        setError(data.error || "Verification failed.");
        setLoading(false);
        return;
      }

      router.refresh();
      if (data.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(`/dashboard/${data.role.toLowerCase()}`);
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
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
      }}
    >
      <Paper elevation={8} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          Admin Verification
        </Typography>

        <form onSubmit={handleVerify}>
          <TextField
            label="Employee ID"
            fullWidth
            required
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Store Number"
            fullWidth
            required
            value={storeNumber}
            onChange={(e) => setStoreNumber(e.target.value)}
            margin="normal"
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
              "&:hover": {
                backgroundColor: "#5b3f2f",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Verify & Continue"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
