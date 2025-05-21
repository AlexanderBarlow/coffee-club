"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    TextField,
    Stack,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    IconButton,
    Button,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRouter } from "next/navigation";

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/admin/users");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error("Failed to load users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleTierChange = async (userId, direction) => {
        try {
            await fetch("/api/admin/users/tier", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, direction }),
            });
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("Failed to update tier:", err);
        }
    };

    const handlePointsChange = async (userId, amount) => {
        try {
            await fetch("/api/admin/users/points", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, amount }),
            });
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("Failed to update points:", err);
        }
    };

    const filteredUsers = users.filter((u) =>
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}>
            <Typography variant="h4" fontWeight={700} mb={4} color="#6f4e37">
                👥 User Management
            </Typography>

            <TextField
                fullWidth
                label="Search by email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 3 }}
            />

            {loading ? (
                <CircularProgress />
            ) : (
                <Stack spacing={3}>
                    {filteredUsers.map((user) => (
                        <Paper key={user.id} sx={{ p: 3 }} elevation={2}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    rowGap: 2,
                                }}
                            >
                                <Box>
                                    <Typography fontWeight={700}>{user.email}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tier: {user.tier} • Points: {user.points}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Role: {user.role?.name || "USER"}
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <IconButton color="success" onClick={() => handleTierChange(user.id, "up")}> <ArrowUpwardIcon /> </IconButton>
                                    <IconButton color="warning" onClick={() => handleTierChange(user.id, "down")}> <ArrowDownwardIcon /> </IconButton>
                                    <IconButton color="primary" onClick={() => handlePointsChange(user.id, 10)}> <AddIcon /> </IconButton>
                                    <IconButton color="error" onClick={() => handlePointsChange(user.id, -10)}> <RemoveIcon /> </IconButton>
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.push(`/admin/users/${user.id}/history`)}
                                    >
                                        View Orders
                                    </Button>
                                </Stack>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );
}
