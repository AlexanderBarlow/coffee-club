// File: components/ReviewsSection.js

"use client";

import { useEffect, useState } from "react";
import { Avatar, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function ReviewsSection() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch("/api/reviews");
                const data = await res.json();
                if (Array.isArray(data)) setReviews(data);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            }
        };
        fetchReviews();
    }, []);

    if (reviews.length === 0) return null;

    return (
        <section className="py-20 px-4 bg-white z-10 relative">
            <div className="max-w-5xl mx-auto text-center">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    💬 What Our Users Say
                </Typography>
                <div className="grid sm:grid-cols-3 gap-6 mt-6">
                    {reviews.slice(0, 6).map((review) => (
                        <motion.div
                            key={review.id}
                            className="bg-[#f9f9f9] rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                            whileHover={{ scale: 1.03 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Avatar sx={{ bgcolor: "#6f4e37", width: 32, height: 32 }}>
                                    {review.user?.email?.[0]?.toUpperCase() || "U"}
                                </Avatar>
                                <p className="font-medium text-gray-800 text-sm truncate">
                                    {review.user?.email || "Anonymous"}
                                </p>
                                <span className="ml-auto text-yellow-400">
                                    {"★".repeat(review.rating)}
                                </span>
                            </div>
                            <p className="text-gray-600 italic text-sm">“{review.comment}”</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
