// app/verify/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, Box, CircularProgress } from "@mui/material";
import { supabase } from "@/lib/supabaseClient";

export default function VerifyPage() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        clearInterval(interval);
        router.push("/dashboard");
      }
    }, 3000); // check every 3s

    return () => clearInterval(interval);
  }, [router]);

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 10, px: 2, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Your Email 📬
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        We’ve sent you an email to verify your account.
        <br />
        Once you confirm, this page will automatically redirect you to your
        dashboard.
      </Typography>
      <Box sx={{ mt: 5 }}>
        <CircularProgress />
      </Box>
    </Box>
  );
}
