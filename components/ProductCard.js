"use client";

import { Box, Typography, IconButton, Paper } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function ProductCard({ drink }) {
  const router = useRouter();

  const handleCustomizeClick = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
    } else {
      router.push(`/customize/${drink.id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ width: "100%" }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          display: "flex",
          height: 150,
          p: 2,
          backgroundColor: "#fffdfb",
        }}
      >
        {/* Left: Image */}
        <Box
          sx={{
            flexShrink: 0,
            width: 100,
            height: "100%",
            borderRadius: 1.5,
            overflow: "hidden",
            mr: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={drink.imageUrl || "/images/fallback.jpg"}
            alt={drink.name}
            width={80}
            height={80}
            loading="lazy"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "auto",
              maxHeight: "100%",
            }}
          />
        </Box>

        {/* Right: Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              color="#3e3028"
              sx={{
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {drink.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                maxHeight: 40,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {drink.description}
            </Typography>
          </Box>

          <Box
            mt={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={600} fontSize="1rem" color="#6f4e37">
              ${drink.price.toFixed(2)}
            </Typography>

            <IconButton
              onClick={handleCustomizeClick}
              sx={{
                backgroundColor: "#6f4e37",
                color: "white",
                "&:hover": {
                  backgroundColor: "#5b3f2f",
                },
                borderRadius: "999px",
              }}
            >
              <AddCircleIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}
