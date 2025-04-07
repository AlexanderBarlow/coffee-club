"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";


export default function ProductCard({ drink, onCustomize }) {

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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{ width: "100%" }}
    >
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <CardMedia
          component="img"
          image={drink.imageUrl}
          alt={drink.name}
          sx={{
            height: 180, // ✅ fixed image height
            objectFit: "cover",
            objectPosition: "center",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {drink.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ minHeight: 48 }}
            >
              {drink.description}
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography fontWeight={600}>${drink.price.toFixed(2)}</Typography>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                mt: 1,
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 2,
              }}
              onClick={() => handleCustomizeClick(drink)}
            >
              Customize
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
