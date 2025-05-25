// app/admin/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { SalesTrendGraph } from "@/components/admin/SalesTrendGraph";
import { PayrollVsRevenue } from "@/components/admin/PayrollvsRevenue";
import { EmployeeRolesChart } from "@/components/admin/EmployeeRolesChart";
import { TopItemsChart } from "@/components/admin/TopItemsChart";
import { LaborHoursChart } from "@/components/admin/LaborHoursChart";
import { MetricCards } from "@/components/admin/MetricCards";

export default function AdminHomePage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const metrics = stats
    ? [
        { label: "Total Orders", value: stats.totalOrders },
        { label: "Revenue", value: `$${stats.totalRevenue.toFixed(2)}` },
        { label: "Avg Ticket", value: `$${stats.avgTicket.toFixed(2)}` },
        { label: "Avg Time", value: `${stats.avgTicketTimeMinutes} mins` },
        {
          label: "Satisfaction",
          value: stats.avgRating ? `${stats.avgRating.toFixed(1)} ★` : "N/A",
        },
      ]
    : [];

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

        {loading || !stats ? (
          <Box textAlign="center" mt={8}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <MetricCards metrics={metrics} />

            <Grid container spacing={3} justifyContent="center" mb={3}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <SalesTrendGraph salesData={stats.weeklySalesData} />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <PayrollVsRevenue
                    payrollData={stats.payrollByMonth}
                    revenueData={stats.revenueByMonth}
                  />
                </motion.div>
              </Grid>
            </Grid>

            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <EmployeeRolesChart rolesData={stats.employeeCounts} />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <TopItemsChart
                    itemsData={Object.fromEntries(
                      stats.topItems.map((i) => [i.name, i.count])
                    )}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <LaborHoursChart hoursData={stats.totalLaborHours} />
                </motion.div>
              </Grid>
            </Grid>
          </>
        )}
      </motion.div>
    </Container>
  );
}
