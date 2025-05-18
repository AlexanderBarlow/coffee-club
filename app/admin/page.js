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

  const totalEmployees = stats
    ? Object.entries(stats.employeeCounts).reduce(
        (sum, [role, count]) =>
          ["USER", "UNKNOWN"].includes(role) ? sum : sum + count,
        0
      )
    : 0;

  const staffToUserRatio = stats?.employeeCounts?.USER
    ? `${(totalEmployees / stats.employeeCounts.USER).toFixed(2)}:1`
    : "-";

  const fadeCard = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <Box
      sx={{
        overflowX: "hidden",
        p: { xs: 2, md: 4 },
        maxWidth: 1400,
        mx: "auto",
      }}
    >
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

        {loading || !stats ? (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={4}>
            {/* Grid of Key Stats */}
            <Grid container spacing={3}>
              {[
                {
                  label: "Total Orders",
                  value: stats.totalOrders,
                },
                {
                  label: "Revenue",
                  value: `$${stats.totalRevenue.toFixed(2)}`,
                },
                {
                  label: "Avg Ticket Value",
                  value: `$${stats.avgTicket.toFixed(2)}`,
                },
                {
                  label: "Avg Ticket Time",
                  value: `${stats.avgTicketTimeMinutes} mins`,
                },
                {
                  label: "Satisfaction",
                  value: stats.avgRating
                    ? `${stats.avgRating.toFixed(1)} ★`
                    : "N/A",
                },
                {
                  label: "Repeat Customers",
                  value: `${stats.repeatCustomers} (${stats.repeatRate}%)`,
                },
                {
                  label: "Unique Customers",
                  value: stats.uniqueCustomers,
                },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div {...fadeCard}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                      <Typography variant="h6" color="#6f4e37" fontWeight={700}>
                        {stat.label}
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={900}
                        color="primary"
                        mt={1}
                      >
                        {stat.value}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Two Column Grid: Team + Top Items */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div {...fadeCard}>
                  <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="h6" color="#6f4e37" fontWeight={700}>
                      Team Overview
                    </Typography>
                    <Stack spacing={1} mt={2} alignItems="center">
                      {Object.entries(stats.employeeCounts)
                        .filter(([role]) => role !== "USER")
                        .map(([role, count]) => (
                          <Typography key={role} variant="body1">
                            <strong>{role}:</strong> {count}
                          </Typography>
                        ))}
                    </Stack>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      Staff-to-User Ratio: <strong>{staffToUserRatio}</strong>
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div {...fadeCard}>
                  <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="#6f4e37"
                      mb={2}
                    >
                      Top Ordered Items
                    </Typography>
                    <Stack spacing={1}>
                      {stats.topItems.map((item, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>{item.name}</Typography>
                          <Typography fontWeight={600}>{item.count}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>

            {/* Sales Chart */}
            <motion.div {...fadeCard}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="#6f4e37"
                  mb={2}
                >
                  Sales This Week
                </Typography>

                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 250, md: 400 },
                  }}
                >
                  <Line data={salesData} options={salesOptions} />
                </Box>
              </Paper>
            </motion.div>
          </Stack>
        )}
      </motion.div>
    </Box>
  );
}
