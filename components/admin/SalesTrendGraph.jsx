// components/admin/SalesTrendGraph.jsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const salesVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export function SalesTrendGraph({ salesData }) {
  const isLoading = !salesData || Object.keys(salesData).length === 0;
  if (isLoading) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={salesVariants}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 4,
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Paper>
      </motion.div>
    );
  }
  const data = Object.entries(salesData).map(([day, sales]) => ({
    day,
    sales,
  }));
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={salesVariants}
      transition={{ duration: 0.6 }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 4,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(111, 78, 55, 0.15)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          color="#6f4e37"
          sx={{ mb: 2 }}
        >
          📈 Weekly Sales Trend
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6f4e37" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6f4e37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="day" tick={{ fill: "#6f4e37" }} />
              <YAxis tick={{ fill: "#6f4e37" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff9f4",
                  borderColor: "#6f4e37",
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#6f4e37"
                strokeWidth={3}
                fill="url(#salesGradient)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </motion.div>
  );
}
