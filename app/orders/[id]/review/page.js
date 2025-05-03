"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Box,
    Typography,
    TextField,
    Button,
    Rating,
    Paper,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";

export default function ReviewOrderPage() {
    const { id: orderId } = useParams();
    const router = useRouter();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [userId, setUserId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUserId(user?.id || null);
        };

        fetchUser();
    }, []);

    const handleSubmit = async () => {
        if (!rating || !comment.trim() || !userId) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, rating, comment, userId }),
            });

            if (res.ok) {
                router.push("/dashboard");
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || "Failed to submit review."}`);
            }
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
                Leave a Review
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography fontWeight={600} mb={1}>
                    How was your order?
                </Typography>

                <Rating
                    value={rating}
                    onChange={(_, newValue) => setRating(newValue)}
                    size="large"
                />

                <TextField
                    label="Comments"
                    multiline
                    rows={4}
                    fullWidth
                    sx={{ mt: 2 }}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{ mt: 2, backgroundColor: "#6f4e37" }}
                    disabled={submitting || !rating || !comment.trim()}
                >
                    {submitting ? "Submitting..." : "Submit Review"}
                </Button>
            </Paper>
        </Box>
    );
}
