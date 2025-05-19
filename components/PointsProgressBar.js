// components/dashboard/RewardProgress.js
import { Box, Typography, LinearProgress } from "@mui/material";

const tierThresholds = {
    BRONZE: { max: 200, next: "SILVER" },
    SILVER: { max: 400, next: "GOLD" },
    GOLD: { max: 600, next: "VIP" },
    VIP: { max: 1000, next: null },
};

export default function RewardProgress({ tier, points }) {
    const current = tierThresholds[tier] || { max: 100, next: "BRONZE" };
    const progress = Math.min((points / current.max) * 100, 100);

    return (
        <Box sx={{ mt: 3 }}>
            <Typography fontWeight={500} mb={1}>
                Progress to {current.next ?? "maintaining VIP"}
            </Typography>
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" mt={1} color="text.secondary">
                {points} / {current.max} points
            </Typography>
        </Box>
    );
}
