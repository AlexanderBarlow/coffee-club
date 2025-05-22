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
  Container
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
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

  const weeklySalesData = {
    labels: stats ? Object.keys(stats.weeklySalesData || {}) : [],
    datasets: [
      {
        label: "Sales ($)",
        data: stats ? Object.values(stats.weeklySalesData || {}) : [],
        borderColor: "#6f4e37",
        backgroundColor: "rgba(111, 78, 55, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const payrollVsRevenueData = {
    labels: stats ? Object.keys(stats.payrollByMonth || {}) : [],
    datasets: [
      {
        label: "Revenue ($)",
        data: stats ? Object.keys(stats.payrollByMonth || {}).map((key) => stats.revenueByMonth?.[key] || 0) : [],
        backgroundColor: "#6f4e37",
      },
      {
        label: "Payroll ($)",
        data: stats ? Object.values(stats.payrollByMonth || {}) : [],
        backgroundColor: "#a0522d",
      },
    ],
  };

  const employeeChart = {
    labels: stats ? Object.keys(stats.employeeCounts || {}) : [],
    datasets: [
      {
        label: "Employees",
        data: stats ? Object.values(stats.employeeCounts || {}) : [],
        backgroundColor: ["#6f4e37", "#a0522d", "#d2b48c", "#deb887", "#8b4513"],
      },
    ],
  };

  const topItemsChart = {
    labels: stats?.topItems?.map((i) => i.name) || [],
    datasets: [
      {
        label: "Orders",
        data: stats?.topItems?.map((i) => i.count) || [],
        backgroundColor: "#6f4e37",
      },
    ],
  };

  const laborHoursChart = {
    labels: ["Labor Hours"],
    datasets: [
      {
        label: "Total Labor Hours",
        data: [stats?.totalLaborHours || 0],
        backgroundColor: "#6f4e37",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: true } },
  };

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
              <Grid item xs={12} md={6}>
                <motion.div {...fadeCard}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="#6f4e37" mb={1}>Sales This Week</Typography>
                    <Box sx={{ height: 300 }}>
                      <Line data={weeklySalesData} options={chartOptions} />
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div {...fadeCard}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="#6f4e37" mb={1}>Payroll vs Revenue</Typography>
                    <Box sx={{ height: 300 }}>
                      <Bar data={payrollVsRevenueData} options={chartOptions} />
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>

            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <motion.div {...fadeCard}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="#6f4e37" mb={1}>Employee Roles</Typography>
                    <Box sx={{ height: 300 }}>
                      <Pie data={employeeChart} options={chartOptions} />
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div {...fadeCard}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="#6f4e37" mb={1}>Top Items</Typography>
                    <Box sx={{ height: 300 }}>
                      <Bar data={topItemsChart} options={chartOptions} />
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <motion.div {...fadeCard}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight={700} color="#6f4e37" mb={1}>Labor Hours</Typography>
                    <Box sx={{ height: 300 }}>
                      <Bar data={laborHoursChart} options={chartOptions} />
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </>
        )}
      </motion.div>
    </Container>
  );
}
