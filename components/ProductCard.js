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
          p: 2,
          backgroundColor: "#fffdfb",
          height: {
            xs: 150,
            sm: 160,
            md: 180,
            lg: 200,
          },
        }}
      >
        {/* Image */}
        <Box
          sx={{
            flexShrink: 0,
            width: {
              xs: 90,
              sm: 100,
              md: 120,
              lg: 130,
            },
            height: "100%",
            borderRadius: 2,
            overflow: "hidden",
            mr: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f4f4f4",
          }}
        >
          <Image
            src={drink.imageUrl || "/images/fallback.jpg"}
            alt={drink.name}
            loading="lazy"
            width={120}
            height={120}
            style={{
              objectFit: "contain",
              maxHeight: "100%",
              maxWidth: "100%",
              borderRadius: "8px",
            }}
          />
        </Box>

        {/* Text Content */}
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
                lineHeight: 1.3,
                fontSize: { xs: "1rem", md: "1.1rem", lg: "1.2rem" },
                maxHeight: 48,
                overflow: "hidden",
                textOverflow: "ellipsis",
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
                maxHeight: 40,
                overflow: "hidden",
                textOverflow: "ellipsis",
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
