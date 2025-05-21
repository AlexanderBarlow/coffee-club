"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    Stack,
    Button,
    Modal,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RoleIcon from "@mui/icons-material/SupervisorAccount";

const roleOptions = ["BARISTA", "MANAGER", "SUPERVISOR", "ADMIN"];

export default function StaffPage() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [roleSelections, setRoleSelections] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newRole, setNewRole] = useState("USER");
    const [employeeNumber, setEmployeeNumber] = useState("");
    const [storeNumber, setStoreNumber] = useState("");
    const [addLoading, setAddLoading] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const fetchStaff = async () => {
        try {
            const res = await fetch("/api/admin/staff");
            const data = await res.json();
            setStaff(data);
            const roleMap = {};
            data.forEach((s) => (roleMap[s.id] = s.role?.name || "USER"));
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

    const handleChangeRole = async (id, newRole) => {
        await fetch("/api/admin/staff/promote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: id, newRole }),
        });
        fetchStaff();
    };

    const handleAddStaff = async () => {
        setAddLoading(true);
        await fetch("/api/admin/staff/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: newEmail, role: newRole, employeeNumber, storeNumber }),
        });
        setNewEmail("");
        setNewRole("USER");
        setEmployeeNumber("");
        setStoreNumber("");
        setAddLoading(false);
        setModalOpen(false);
        fetchStaff();
    };

    const filteredStaff = staff
        .filter((s) => s.email.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortOption === "alphabetical") return a.email.localeCompare(b.email);
            if (sortOption === "role") return a.role.name.localeCompare(b.role.name);
            return 0;
        });

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}>
            <Typography variant="h4" fontWeight={700} color="#6f4e37" mb={4} textAlign="center">
                👥 Staff Management
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
                <TextField
                    fullWidth
                    placeholder="Search by email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl fullWidth>
                    <InputLabel>Sort</InputLabel>
                    <Select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        label="Sort"
                    >
                        <MenuItem value="default">Default</MenuItem>
                        <MenuItem value="alphabetical">Alphabetical</MenuItem>
                        <MenuItem value="role">By Role</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setModalOpen(true)}
                sx={{ backgroundColor: "#6f4e37", "&:hover": { backgroundColor: "#5c3e2e" }, mb: 3 }}
                fullWidth={isMobile}
            >
                Add Staff
            </Button>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box
                    sx={{
                        width: "90%",
                        maxWidth: 400,
                        mx: "auto",
                        mt: 10,
                        p: 3,
                        backgroundColor: "white",
                        borderRadius: 2,
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Add New Staff Member
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            fullWidth
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <TextField
                            label="Employee Number"
                            fullWidth
                            value={employeeNumber}
                            onChange={(e) => setEmployeeNumber(e.target.value)}
                        />
                        <TextField
                            label="Store Number"
                            fullWidth
                            value={storeNumber}
                            onChange={(e) => setStoreNumber(e.target.value)}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select value={newRole} onChange={(e) => setNewRole(e.target.value)} label="Role">
                                {roleOptions.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            onClick={handleAddStaff}
                            disabled={addLoading || !newEmail || !employeeNumber || !storeNumber}
                            sx={{ backgroundColor: "#6f4e37", "&:hover": { backgroundColor: "#5c3e2e" } }}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            {loading ? (
                <Box textAlign="center" mt={6}>
                    <CircularProgress />
                </Box>
            ) : staff.length === 0 ? (
                <Typography textAlign="center">No staff members found.</Typography>
            ) : (
                <Stack spacing={3}>
                    {filteredStaff.map((member) => (
                        <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Paper sx={{ p: 3 }} elevation={3}>
                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    spacing={2}
                                >
                                    <Box>
                                        <Typography variant="h6">{member.email}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Role: {member.role?.name || "Unknown"}
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                            <Select
                                                value={roleSelections[member.id] || member.role?.name || "USER"}
                                                onChange={(e) => handleChangeRole(member.id, e.target.value)}
                                            >
                                                {roleOptions.map((role) => (
                                                    <MenuItem key={role} value={role}>
                                                        {role}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <RoleIcon color="action" />
                                    </Stack>
                                </Stack>
                            </Paper>
                        </motion.div>
                    ))}
                </Stack>
            )}
        </Box>
    );
}
