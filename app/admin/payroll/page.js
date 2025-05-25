"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";

export default function PayrollPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [editState, setEditState] = useState({});

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payroll", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching payroll:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const handleFieldChange = (id, field, value) => {
    setData((d) => d.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
    setEditState((e) => ({ ...e, [id]: true }));
  };

  const handleSave = async (id) => {
    const user = data.find((u) => u.id === id);
    try {
      await fetch(`/api/admin/payroll/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hoursWorked: parseFloat(user.hoursWorked),
          hourlyRate: parseFloat(user.hourlyRate),
        }),
      });
      setEditState((e) => ({ ...e, [id]: false }));
      fetchPayroll();
    } catch (err) {
      console.error("Error saving payroll:", err);
    }
  };

  const handleSimulatePay = async () => {
    setPayLoading(true);
    try {
      await fetch("/api/admin/payroll", { method: "POST" });
      fetchPayroll();
    } catch (err) {
      console.error("Error simulating pay:", err);
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={700}
          color="#6f4e37"
        >
          🕑 Payroll Management
        </Typography>
        <Button
          variant="contained"
          onClick={handleSimulatePay}
          disabled={payLoading}
        >
          {payLoading ? "Processing..." : "Simulate Pay"}
        </Button>
      </Stack>

      <Stack spacing={3}>
        {data.map((user) => (
          <Paper key={user.id} sx={{ p: 3 }} elevation={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{user.email}</Typography>
              </Box>
              <TextField
                label="Hours Worked"
                type="number"
                value={user.hoursWorked}
                onChange={(e) =>
                  handleFieldChange(user.id, "hoursWorked", e.target.value)
                }
                size="small"
                sx={{ width: 120 }}
              />
              <TextField
                label="Hourly Rate"
                type="number"
                value={user.hourlyRate}
                onChange={(e) =>
                  handleFieldChange(user.id, "hourlyRate", e.target.value)
                }
                size="small"
                sx={{ width: 120 }}
              />
              <TextField
                label="Pay Due"
                value={(user.hoursWorked * user.hourlyRate).toFixed(2)}
                size="small"
                sx={{ width: 120 }}
                InputProps={{ readOnly: true }}
              />
              {editState[user.id] && (
                <Button variant="outlined" onClick={() => handleSave(user.id)}>
                  Save
                </Button>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
