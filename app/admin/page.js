"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AdminHomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const salesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales ($)",
        data: [120, 190, 300, 250, 400, 220, 500],
        borderColor: "#6f4e37",
        backgroundColor: "#6f4e37",
        tension: 0.3,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <Box sx={{ overflowX: "hidden", p: { xs: 2, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          color="#6f4e37"
          textAlign="center"
          mb={3}
        >
          Welcome, Admin ☕
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          mb={5}
        >
          Manage orders, customize the menu, and keep Coffee Club running
          smoothly.
        </Typography>

        {/* Quick Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
            mb: 6,
          }}
        >
          <Button
            variant="contained"
            onClick={() => router.push("/admin/orders")}
            sx={{
              backgroundColor: "#6f4e37",
              px: 4,
              py: 1.5,
              borderRadius: 99,
              fontWeight: 600,
              "&:hover": { backgroundColor: "#5c3e2e" },
            }}
          >
            View Orders
          </Button>

          <Button
            variant="outlined"
            onClick={() => router.push("/admin/menu")}
            sx={{
              borderColor: "#6f4e37",
              color: "#6f4e37",
              px: 4,
              py: 1.5,
              borderRadius: 99,
              fontWeight: 600,
              "&:hover": { borderColor: "#5c3e2e", color: "#5c3e2e" },
            }}
          >
            Manage Menu
          </Button>
        </Box>

        {/* Stats and Charts */}
        <Grid container spacing={4}>
          {/* Stat Cards */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 3, textAlign: "center", backgroundColor: "#fff" }}
            >
              <Typography variant="h6" color="#6f4e37" fontWeight={700}>
                Total Orders
              </Typography>
              <Typography variant="h4" fontWeight={900} color="primary" mt={1}>
                1,245
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 3, textAlign: "center", backgroundColor: "#fff" }}
            >
              <Typography variant="h6" color="#6f4e37" fontWeight={700}>
                Revenue
              </Typography>
              <Typography variant="h4" fontWeight={900} color="primary" mt={1}>
                $23,400
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 3, textAlign: "center", backgroundColor: "#fff" }}
            >
              <Typography variant="h6" color="#6f4e37" fontWeight={700}>
                Active Users
              </Typography>
              <Typography variant="h4" fontWeight={900} color="primary" mt={1}>
                512
              </Typography>
            </Paper>
          </Grid>

          {/* Sales Chart */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "#fff",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#6f4e37" mb={2}>
                Sales This Week
              </Typography>

              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 250, md: 400 },
                }}
              >
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Line data={salesData} options={salesOptions} />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}
