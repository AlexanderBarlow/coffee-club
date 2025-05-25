// components/admin/StaffSearchBar.jsx
"use client";
import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/**
 * StaffSearchBar
 * Props:
 * - value: string
 * - onChange: (e) => void
 */
export function StaffSearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      placeholder="Search by email"
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
  );
}
