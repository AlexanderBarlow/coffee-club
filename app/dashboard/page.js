// app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const user = session.user;

      // Fetch user from your own Prisma-backed database (via API route)
      const res = await fetch(`/api/user/${user.id}`);
      const result = await res.json();

      if (result.error) {
        console.error(result.error);
      } else {
        setUserData(result);
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 8, px: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={4}
          sx={{ borderRadius: 4, p: 4, textAlign: "center" }}
        >
          <Typography variant="h5" fontWeight={600}>
            Welcome back 👋
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Tier:</strong> {userData.tier}
          </Typography>
          <Typography variant="body1">
            <strong>Points:</strong> {userData.points}
          </Typography>

          <Button
            onClick={handleSignOut}
            variant="outlined"
            fullWidth
            sx={{ mt: 4, textTransform: "none" }}
          >
            Sign Out
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
}
