"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";

export default function AdminVerifyForm() {
  const [employeeId, setEmployeeId] = useState("");
  const [storeNumber, setStoreNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, storeNumber }),
      });

      const result = await res.json();

      if (!res.ok) return setError(result.error || "Verification failed");

      router.push("/admin"); // verified!
    } catch (err) {
      setError("Unexpected error. Please try again.");
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
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
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
            sx={{ mt: 3, backgroundColor: "#6f4e37" }}
          >
            Verify & Continue
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
