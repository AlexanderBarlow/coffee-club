// app/admin/barista/page.js
"use client";

import { Typography, Box } from "@mui/material";
import TicketBoard from "@/components/TicketSystem";

export default function BaristaTicketsPage() {
    return (
        <Box sx={{ p: 2 }}>
            <TicketBoard />
        </Box>
    );
}
