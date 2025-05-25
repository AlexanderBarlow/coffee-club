"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const pieVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};
const COLORS = ["#6f4e37", "#a0522d", "#d2b48c", "#deb887", "#8b4513"];

export function EmployeeRolesChart({ rolesData }) {
  const isLoading = !rolesData || Object.keys(rolesData).length === 0;
  if (isLoading) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={pieVariants}
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
  const data = Object.entries(rolesData).map(([name, value]) => ({
    name,
    value,
  }));
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pieVariants}
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
          👥 Employee Roles
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff9f4",
                  borderColor: "#6f4e37",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </motion.div>
  );
}
