// components/admin/PayrollVsRevenue.jsx
"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const payrollVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export function PayrollVsRevenue({ payrollData, revenueData }) {
  const isLoading = !payrollData || Object.keys(payrollData).length === 0;
  if (isLoading) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={payrollVariants}
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
  const data = Object.keys(payrollData).map((month) => ({
    month,
    payroll: payrollData[month],
    revenue: revenueData?.[month] || 0,
  }));
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={payrollVariants}
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
          💼 Payroll vs Revenue
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="month" tick={{ fill: "#6f4e37" }} />
              <YAxis tick={{ fill: "#6f4e37" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff9f4",
                  borderColor: "#6f4e37",
                }}
              />
              <Bar dataKey="payroll" barSize={20} fill="#a0522d" />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6f4e37"
                strokeWidth={3}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </motion.div>
  );
}
