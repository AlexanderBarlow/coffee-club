"use client";

import {
  Box,
  Typography,
  IconButton,
  Paper,
  useMediaQuery,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function ProductCard({ drink, onCustomize }) {
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleCustomizeClick = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
    } else {
      console.log(drink)
      onCustomize?.(drink);
    }
  };

  return (
    <motion.div
      whileHover={!isMobile ? { scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 180, damping: 16 }}
      style={{ width: "100%" }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          display: "flex",
          p: 2,
          backgroundColor: "#fffdfb",
          boxShadow: isMobile
            ? "0 1px 3px rgba(0,0,0,0.04)"
            : "0 2px 6px rgba(0,0,0,0.08)",
          height: { xs: 150, sm: 170, md: 190, lg: 200 },
          transition: "box-shadow 0.3s ease",
          "&:hover": !isMobile
            ? { boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }
            : {},
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: 80, sm: 90, md: 105, lg: 110 },
            height: "100%",
            borderRadius: 2,
            overflow: "hidden",
            mr: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f3f3f3",
          }}
        >
          <Image
            src={drink.imageUrl || "/images/fallback.jpg"}
            alt={drink.name}
            width={120}
            height={120}
            loading="lazy"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
              borderRadius: "12px",
            }}
          />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          <Box sx={{ pr: 1 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              color="#3e3028"
              sx={{
                fontSize: { xs: "1rem", md: "1.1rem", lg: "1.2rem" },
                lineHeight: 1.3,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {drink.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
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
            <Typography
              fontWeight={600}
              fontSize={{ xs: "1rem", sm: "1.05rem" }}
              color="#6f4e37"
            >
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
