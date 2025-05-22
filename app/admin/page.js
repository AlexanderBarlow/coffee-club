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
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#6f4e37", "#a9746e", "#b88b4a", "#dab49d", "#f6e0b5"];

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

  const weeklySalesArray = stats
    ? Object.entries(stats.weeklySalesData).map(([day, value]) => ({
        day,
        value,
      }))
    : [];

  const employeeData = stats
    ? Object.entries(stats.employeeCounts).map(([role, count]) => ({
        role,
        count,
      }))
    : [];

  const topItems = stats?.topItems || [];

  const metricCards = [
    { label: "Total Orders", value: stats?.totalOrders },
    { label: "Revenue", value: `$${stats?.totalRevenue.toFixed(2)}` },
    { label: "Avg Ticket", value: `$${stats?.avgTicket.toFixed(2)}` },
    { label: "Avg Time", value: `${stats?.avgTicketTimeMinutes} mins` },
    {
      label: "Satisfaction",
      value: stats?.avgRating ? `${stats.avgRating.toFixed(1)} ★` : "N/A",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            Monitor performance, track staff metrics, and evaluate shop health.
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
          <Box textAlign="center" mt={8}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} mb={4} justifyContent="center">
              {metricCards.map(({ label, value }) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={label}>
                  <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#6f4e37">
                      {value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="#6f4e37"
                    mb={2}
                  >
                    Weekly Sales
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={weeklySalesArray}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#6f4e37"
                        fill="#f6e0b5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="#6f4e37"
                    mb={2}
                  >
                    Employee Roles
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={employeeData}
                        dataKey="count"
                        nameKey="role"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {employeeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="#6f4e37"
                    mb={2}
                  >
                    Top Items
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topItems}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6f4e37" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </motion.div>
    </Container>
  );
}
