// components/admin/payroll/PayrollList.jsx
"use client";
import React from "react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { PayrollRow } from "./PayrollRow";

/**
 * PayrollList
 * Props:
 *  - data: Array of users
 *  - loading: boolean
 *  - editState: Record<id, boolean>
 *  - onFieldChange: fn
 *  - onSave: fn
 */
export function PayrollList({
  data,
  loading,
  editState,
  onFieldChange,
  onSave,
}) {
  if (loading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }
  if (!data.length) {
    return <Typography textAlign="center">No payroll records.</Typography>;
  }
  return (
    <Stack spacing={3}>
      {data.map((user) => (
        <PayrollRow
          key={user.id}
          user={user}
          edit={!!editState[user.id]}
          onFieldChange={onFieldChange}
          onSave={onSave}
        />
      ))}
    </Stack>
  );
}
