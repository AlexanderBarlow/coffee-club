// app/admin/barista/punch/page.js
"use client";

import { Box, Typography, Paper } from "@mui/material";
import PunchClock from "@/components/BaristaPunchClock";

export default function BaristaPunchPage() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={700} color="#6f4e37" mb={3}>
                Punch Clock
            </Typography>

            <Paper elevation={3} sx={{ p: 3 }}>
                <PunchClock />
            </Paper>
        </Box>
    );
} 
