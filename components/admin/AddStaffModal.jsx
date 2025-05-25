// components/admin/AddStaffModal.jsx
"use client";
import React from "react";
import {
  Modal,
  Box,
  Typography,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const style = {
  width: "90%",
  maxWidth: 400,
  mx: "auto",
  mt: 10,
  p: 3,
  backgroundColor: "white",
  borderRadius: 2,
  boxShadow: 24,
};

/**
 * AddStaffModal
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSubmit: () => void
 * - loading: boolean
 * - formValues: { email, employeeNumber, storeNumber, role }
 * - onChange: (field, value) => void
 */
export function AddStaffModal({
  open,
  onClose,
  onSubmit,
  loading,
  formValues,
  onChange,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Add New Staff Member
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Email"
            fullWidth
            value={formValues.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
          <TextField
            label="Employee Number"
            fullWidth
            value={formValues.employeeNumber}
            onChange={(e) => onChange("employeeNumber", e.target.value)}
          />
          <TextField
            label="Store Number"
            fullWidth
            value={formValues.storeNumber}
            onChange={(e) => onChange("storeNumber", e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={formValues.role}
              label="Role"
              onChange={(e) => onChange("role", e.target.value)}
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
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={onSubmit}
            disabled={
              loading ||
              !formValues.email ||
              !formValues.employeeNumber ||
              !formValues.storeNumber
            }
            sx={{
              backgroundColor: "#6f4e37",
              "&:hover": { backgroundColor: "#5c3e2e" },
            }}
          >
            {loading ? "Adding..." : "Submit"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
