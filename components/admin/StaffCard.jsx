// components/admin/StaffCard.jsx
"use client";
import React, { useState } from "react";
import {
  Paper,
  Stack,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import RoleIcon from "@mui/icons-material/SupervisorAccount";

/**
 * StaffCard
 * Props:
 * - member: { id, email, role }
 * - currentRole: string
 * - onRoleChange: (id, newRole) => void
 */
export function StaffCard({ member, currentRole, onRoleChange }) {
  const [viewPayroll, setViewPayroll] = useState(false);

  return (
    <Paper sx={{ p: 3 }} elevation={3}>
      <Stack spacing={2}>
        {!viewPayroll ? (
          <>
            <Box>
              <Typography variant="h6">{member.email}</Typography>
              <Typography variant="body2" color="text.secondary">
                Role: {member.role?.name || "USER"}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={currentRole}
                  onChange={(e) => onRoleChange(member.id, e.target.value)}
                >
                  {["USER", "BARISTA", "SUPERVISOR", "MANAGER", "ADMIN"].map(
                    (role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
              <RoleIcon color="action" />
            </Stack>
            <Button variant="outlined" onClick={() => setViewPayroll(true)}>
              Show Payroll
            </Button>
          </>
        ) : (
          <>
            <Typography variant="subtitle1">Payroll Data</Typography>
            <Typography>
              Hours Worked: {member.payroll?.hoursWorked || "N/A"}
            </Typography>
            <Typography>
              Pay Rate: ${member.payroll?.hourlyRate?.toFixed(2) || "N/A"}
            </Typography>
            <Typography>
              Total Pay: ${member.payroll?.totalPay?.toFixed(2) || "N/A"}
            </Typography>
            <Button variant="outlined" onClick={() => setViewPayroll(false)}>
              Back to Profile
            </Button>
          </>
        )}
      </Stack>
    </Paper>
  );
}
