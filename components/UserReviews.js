"use client";

import { Box, Typography, Paper, Rating } from "@mui/material";

export default function UserReviews({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return (
            <Box sx={{ mt: 4 }}>
                <Typography color="black">No reviews yet.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            {reviews.map((review) => (
                <Paper
                    key={review.id}
                    sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography fontWeight={600}>
                            Order #{review.orderId.slice(0, 8)}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body2" fontStyle="italic" color="text.secondary">
                        “{review.comment}”
                    </Typography>
                </Paper>
            ))}
        </Box>
    );
}
