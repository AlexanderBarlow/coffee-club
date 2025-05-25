// components/admin/payroll/PayrollRow.jsx
"use client";
import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";

/**
 * PayrollRow
 * Props:
 *  - user: { id, email, hoursWorked, hourlyRate }
 *  - edit: boolean
 *  - saving: boolean
 *  - onFieldChange: (id, field, value) => void
 *  - onSave: (id) => void
 */
export function PayrollRow({ user, edit, saving, onFieldChange, onSave }) {
  const { id, email, hoursWorked, hourlyRate } = user;
  const totalPay = (hoursWorked * hourlyRate).toFixed(2);

  return (
    <Paper sx={{ p: 3, position: "relative" }} elevation={2}>
      {saving && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">{email}</Typography>
        </Box>
        <TextField
          label="Hours Worked"
          type="number"
          value={hoursWorked}
          onChange={(e) => onFieldChange(id, "hoursWorked", e.target.value)}
          size="small"
          sx={{ width: 120 }}
          disabled={saving}
        />
        <TextField
          label="Hourly Rate"
          type="number"
          value={hourlyRate}
          onChange={(e) => onFieldChange(id, "hourlyRate", e.target.value)}
          size="small"
          sx={{ width: 120 }}
          disabled={saving}
        />
        <TextField
          label="Pay Due"
          value={totalPay}
          size="small"
          sx={{ width: 120 }}
          InputProps={{ readOnly: true }}
        />
        {edit && !saving && (
          <Button variant="outlined" onClick={() => onSave(id)}>
            Save
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
