import { Avatar, Box, Paper, Typography, Skeleton } from "@mui/material";

export default function UserProfileCard({ email, tier, isMobile }) {
    const username = email ? email.split("@")[0] : null;

    return (
        <Paper
            elevation={4}
            sx={{
                borderRadius: 4,
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexDirection: isMobile ? "column" : "row",
                textAlign: isMobile ? "center" : "left",
                backgroundColor: "#fff",
            }}
        >
            <Avatar sx={{ width: 56, height: 56, bgcolor: "#6f4e37" }}>@</Avatar>
            <Box flex={1}>
                {username ? (
                    <Typography variant="h6" fontWeight={700}>
                        @{username}
                    </Typography>
                ) : (
                    <Skeleton width={80} height={28} />
                )}

                {tier ? (
                    <Typography
                        variant="caption"
                        fontWeight={600}
                        sx={{
                            backgroundColor: tier === "VIP" ? "#FFD700" : "#e6d3c0",
                            px: 2,
                            py: 0.5,
                            borderRadius: 99,
                            mt: 0.5,
                            display: "inline-block",
                        }}
                    >
                        {tier}
                    </Typography>
                ) : (
                    <Skeleton width={40} height={16} sx={{ mt: 1 }} />
                )}
            </Box>
        </Paper>
    );
}
