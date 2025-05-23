"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";

export default function BaristaPunchClock() {
    const [loading, setLoading] = useState(true);
    const [shift, setShift] = useState(null);
    const [userId, setUserId] = useState(null);

    const fetchActiveShift = async () => {
        setLoading(true);
        const {
            data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return;

        setUserId(user.id);

        const res = await fetch(`/api/shifts/active?userId=${user.id}`);
        const data = await res.json();
        setShift(data.activeShift || null);
        setLoading(false);
    };

    const handleClockIn = async () => {
        setLoading(true);
        await fetch("/api/shifts/clock-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });
        await fetchActiveShift();
    };

    const handleClockOut = async () => {
        setLoading(true);
        await fetch("/api/shifts/clock-out", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });
        await fetchActiveShift();
    };

    useEffect(() => {
        fetchActiveShift();
    }, []);

    const getShiftDuration = () => {
        if (!shift?.startTime) return null;
        const start = new Date(shift.startTime);
        const now = new Date();
        const diff = Math.floor((now - start) / 1000 / 60); // minutes
        return `${diff} minutes`;
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
                ⏱ Punch Clock
            </Typography>

            {shift ? (
                <>
                    <Typography color="success.main" fontWeight={600}>
                        You are clocked in!
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Shift started: {new Date(shift.startTime).toLocaleTimeString()}
                        <br />
                        Duration: {getShiftDuration()}
                    </Typography>
                    <Button variant="contained" color="error" onClick={handleClockOut}>
                        Clock Out
                    </Button>
                </>
            ) : (
                <>
                    <Typography color="text.secondary" mb={2}>
                        You are currently clocked out.
                    </Typography>
                    <Button variant="contained" color="success" onClick={handleClockIn}>
                        Clock In
                    </Button>
                </>
            )}
        </Paper>
    );
}
