// components/admin/MetricCards.jsx
"use client";

import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

/**
 * MetricCards component
 * Props:
 * - metrics: Array<{ label: string; value: string | number }>
 */
export function MetricCards({ metrics }) {
  return (
    <Grid container spacing={3} mb={4} justifyContent="center">
      {metrics.map(({ label, value }) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={label}>
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeVariants}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="h6" fontWeight={700} color="#6f4e37">
                {value}
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}
