// components/admin/StaffList.jsx
"use client";
import React from "react";
import { Stack, CircularProgress, Typography } from "@mui/material";
import { StaffCard } from "./StaffCard";

/**
 * StaffList
 * Props:
 * - staff: Array of member objects
 * - roleSelections: Record<id, role>
 * - onRoleChange: fn
 * - loading: boolean
 */
export function StaffList({ staff, roleSelections, onRoleChange, loading }) {
  if (loading) {
    return <CircularProgress />;
  }
  if (!staff.length) {
    return <Typography>No staff members found.</Typography>;
  }
  return (
    <Stack spacing={3}>
      {staff.map((member) => (
        <StaffCard
          key={member.id}
          member={member}
          currentRole={roleSelections[member.id]}
          onRoleChange={onRoleChange}
        />
      ))}
    </Stack>
  );
}
