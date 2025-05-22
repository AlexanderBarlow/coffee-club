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
  Stack,
  Divider,
  useMediaQuery,
  useTheme,
  Container,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const salesData = {
    labels: stats ? Object.keys(stats.weeklySalesData) : [],
    datasets: [
      {
        label: "Sales ($)",
        data: stats ? Object.values(stats.weeklySalesData) : [],
        borderColor: "#6f4e37",
        backgroundColor: "#6f4e37",
        tension: 0.3,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  const fadeCard = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const metricCards = [
    { label: "Total Orders", value: stats?.totalOrders },
    { label: "Revenue", value: `$${stats?.totalRevenue.toFixed(2)}` },
    { label: "Avg Ticket", value: `$${stats?.avgTicket.toFixed(2)}` },
    { label: "Avg Time", value: `${stats?.avgTicketTimeMinutes} mins` },
    { label: "Satisfaction", value: stats?.avgRating ? `${stats.avgRating.toFixed(1)} ★` : "N/A" },
  ];

  const chartPlaceholders = [
    "Sales This Week",
    "Labor Hours",
    "Avg Order Time",
    "Inventory Restock",
    "Reward Redemptions",
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant={isMobile ? "h4" : "h3"} fontWeight={700} color="#6f4e37" gutterBottom>
            Welcome, Admin ☕
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor performance, track staff metrics, and evaluate shop health.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={5} justifyContent="center">
          <Button
            variant="contained"
            onClick={() => router.push("/admin/orders")}
            sx={{ backgroundColor: "#6f4e37", "&:hover": { backgroundColor: "#5c3e2e" } }}
          >
            View Orders
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/admin/menu/edit")}
            sx={{ color: "#6f4e37", borderColor: "#6f4e37", "&:hover": { borderColor: "#5c3e2e", color: "#5c3e2e" } }}
          >
            Manage Menu
          </Button>
        </Stack>

        {loading || !stats ? (
          <Box textAlign="center" mt={8}><CircularProgress /></Box>
        ) : (
          <>
            <Grid container spacing={3} mb={4} justifyContent="center">
              {metricCards.map(({ label, value }) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={label}>
                  <motion.div {...fadeCard}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
                      <Typography variant="h6" fontWeight={700} color="#6f4e37">{value}</Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3} justifyContent="center" mb={3}>
              {chartPlaceholders.slice(0, 2).map((title, i) => (
                <Grid item xs={12} md={6} key={title}>
                  <motion.div {...fadeCard}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight={700} color="#6f4e37" mb={1}>{title}</Typography>
                      <Box sx={{ height: 300 }}>
                        <Line data={salesData} options={salesOptions} />
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3} justifyContent="center">
              {chartPlaceholders.slice(2).map((title, i) => (
                <Grid item xs={12} sm={4} key={title}>
                  <motion.div {...fadeCard}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight={700} color="#6f4e37" mb={1}>{title}</Typography>
                      <Box sx={{ height: 250 }}>
                        <Line data={salesData} options={salesOptions} />
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </motion.div>
    </Container>
  );
}
