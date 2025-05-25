// app/admin/staff/page.js
"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  StaffSearchBar,
  SortSelect,
  AddStaffModal,
  StaffList,
} from "@/components/admin";

export default function StaffPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Data & UI state
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [roleSelections, setRoleSelections] = useState({});

  // Modal & form state
  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    employeeNumber: "",
    storeNumber: "",
    role: "USER",
  });
  const [addLoading, setAddLoading] = useState(false);

  // Fetch staff and initialize role map
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      setStaff(data);
      const roleMap = {};
      data.forEach((s) => {
        roleMap[s.id] = s.role?.name || "USER";
      });
      setRoleSelections(roleMap);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Promote or change role
  const handleRoleChange = async (id, newRole) => {
    await fetch("/api/admin/staff/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id, newRole }),
    });
    fetchStaff();
  };

  // Add new staff
  const handleAddStaff = async () => {
    setAddLoading(true);
    await fetch("/api/admin/staff/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });
    setFormValues({
      email: "",
      employeeNumber: "",
      storeNumber: "",
      role: "USER",
    });
    setAddLoading(false);
    setModalOpen(false);
    fetchStaff();
  };

  // Filter & sort
  const filteredStaff = staff
    .filter((s) => s.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "alphabetical") return a.email.localeCompare(b.email);
      if (sortOption === "role") return a.role.name.localeCompare(b.role.name);
      return 0;
    });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="#6f4e37"
        mb={4}
        textAlign="center"
      >
        👥 Staff Management
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <StaffSearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SortSelect
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        />
      </Stack>

      <Button
        variant="contained"
        onClick={() => setModalOpen(true)}
        fullWidth={isMobile}
        sx={{
          backgroundColor: "#6f4e37",
          "&:hover": { backgroundColor: "#5c3e2e" },
          mb: 3,
        }}
      >
        Add Staff
      </Button>

      <AddStaffModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddStaff}
        loading={addLoading}
        formValues={formValues}
        onChange={(field, value) =>
          setFormValues((fv) => ({ ...fv, [field]: value }))
        }
      />

      <StaffList
        staff={filteredStaff}
        roleSelections={roleSelections}
        onRoleChange={handleRoleChange}
        loading={loading}
      />
    </Box>
  );
}
