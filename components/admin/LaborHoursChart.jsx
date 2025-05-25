// components/admin/LaborHoursChart.jsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const laborVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export function LaborHoursChart({ hoursData }) {
  const isLoading = hoursData == null;
  if (isLoading) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={laborVariants}
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
  const data = [{ name: "Labor Hours", value: hoursData }];
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={laborVariants}
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
          ⏱️ Labor Hours
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: "#6f4e37" }} />
              <YAxis tick={{ fill: "#6f4e37" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff9f4",
                  borderColor: "#6f4e37",
                }}
              />
              <Bar dataKey="value" fill="#6f4e37" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </motion.div>
  );
}
