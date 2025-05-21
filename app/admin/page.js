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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            variant={isMobile ? "h4" : "h3"}
            fontWeight={700}
            color="#6f4e37"
            gutterBottom
          >
            Welcome, Admin ☕
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your team, monitor sales, and streamline operations.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          mb={5}
          justifyContent="center"
        >
          <Button
            variant="contained"
            onClick={() => router.push("/admin/orders")}
            sx={{
              backgroundColor: "#6f4e37",
              "&:hover": { backgroundColor: "#5c3e2e" },
            }}
          >
            View Orders
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/admin/menu/edit")}
            sx={{
              color: "#6f4e37",
              borderColor: "#6f4e37",
              "&:hover": { borderColor: "#5c3e2e", color: "#5c3e2e" },
            }}
          >
            Manage Menu
          </Button>
        </Stack>

        {loading || !stats ? (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={4} alignItems="center">
            <Grid container spacing={2} justifyContent="center">
              {[
                "Total Orders",
                "Revenue",
                "Avg Ticket",
                "Avg Time",
                "Satisfaction",
                "Repeat Users",
                "Unique Users",
              ].map((label, i) => {
                const values = [
                  stats.totalOrders,
                  `$${stats.totalRevenue.toFixed(2)}`,
                  `$${stats.avgTicket.toFixed(2)}`,
                  `${stats.avgTicketTimeMinutes} mins`,
                  stats.avgRating ? `${stats.avgRating.toFixed(1)} ★` : "N/A",
                  `${stats.repeatCustomers} (${stats.repeatRate}%)`,
                  stats.uniqueCustomers,
                ];
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    key={label}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <motion.div
                      {...fadeCard}
                      style={{ width: "100%", maxWidth: 350 }}
                    >
                      <Paper
                        elevation={2}
                        sx={{ p: 3, textAlign: "center", height: "100%" }}
                      >
                        <Typography variant="subtitle1" color="text.secondary">
                          {label}
                        </Typography>
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="#6f4e37"
                          mt={1}
                        >
                          {values[i]}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>

            <Grid container spacing={2} justifyContent="center">
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <motion.div
                  {...fadeCard}
                  style={{ width: "100%", maxWidth: 500 }}
                >
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="#6f4e37"
                      mb={2}
                    >
                      Team Overview
                    </Typography>
                    {Object.entries(stats.employeeCounts)
                      .filter(([r]) => r !== "USER")
                      .map(([role, count]) => (
                        <Typography key={role} sx={{ mb: 0.5 }}>
                          <strong>{role}:</strong> {count}
                        </Typography>
                      ))}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Staff-to-User Ratio: <strong>{staffToUserRatio}</strong>
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <motion.div
                  {...fadeCard}
                  style={{ width: "100%", maxWidth: 500 }}
                >
                  <Paper elevation={2} sx={{ p: 3 }}>
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

            <motion.div {...fadeCard} style={{ width: "100%", maxWidth: 1000 }}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="#6f4e37"
                  mb={2}
                >
                  Sales This Week
                </Typography>
                <Box sx={{ height: { xs: 250, md: 400 } }}>
                  <Line data={salesData} options={salesOptions} />
                </Box>
              </Paper>
            </motion.div>
          </Stack>
        )}
      </motion.div>
    </Container>
  );
}
