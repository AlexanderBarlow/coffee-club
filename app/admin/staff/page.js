"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    Avatar,
    Chip,
    Stack,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

export default function StaffPage() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch("/api/admin/staff");
                const data = await res.json();
                setStaff(data);
            } catch (err) {
                console.error("Error fetching staff:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    const getRoleIcon = (role) => {
        switch (role) {
            case "ADMIN":
                return <AdminPanelSettingsIcon color="primary" />;
            case "MANAGER":
                return <SupervisorAccountIcon color="success" />;
            default:
                return <PeopleAltIcon color="action" />;
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
                Staff Directory 👥
            </Typography>

            {loading ? (
                <Box sx={{ textAlign: "center", mt: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {staff.map((member) => (
                        <Grid key={member.id} item xs={12} sm={6} md={4}>
                            <Paper
                                elevation={3}
                                sx={{ p: 3, borderRadius: 3, height: "100%", textAlign: "center" }}
                            >
                                <Avatar
                                    sx={{ width: 60, height: 60, mx: "auto", mb: 2, bgcolor: "#6f4e37" }}
                                >
                                    {member.email.charAt(0).toUpperCase()}
                                </Avatar>

                                <Typography fontWeight={600} gutterBottom>
                                    {member.email}
                                </Typography>

                                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={1}>
                                    {getRoleIcon(member.role?.name)}
                                    <Chip
                                        label={member.role?.name || "Unknown"}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Stack>

                                <Typography variant="body2" color="text.secondary">
                                    Store #: {member.storeNumber || "—"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Employee ID: {member.employeeNumber || "—"}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
