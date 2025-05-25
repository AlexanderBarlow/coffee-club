// components/admin/SortSelect.jsx
"use client";
import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

/**
 * SortSelect
 * Props:
 * - value: string
 * - onChange: (e) => void
 */
export function SortSelect({ value, onChange }) {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="sort-label">Sort</InputLabel>
      <Select
        labelId="sort-label"
        value={value}
        label="Sort"
        onChange={onChange}
      >
        <MenuItem value="default">Default</MenuItem>
        <MenuItem value="alphabetical">Alphabetical</MenuItem>
        <MenuItem value="role">By Role</MenuItem>
      </Select>
    </FormControl>
  );
}
