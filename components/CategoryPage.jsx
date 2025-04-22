"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Container, Skeleton } from "@mui/material";
import ProductCard from "@/components/ProductCard";
import BottomTabBar from "@/components/MobileNavbar";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function CategoryPage({ category, emoji, label }) {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDrinks = async () => {
      const res = await fetch(`/api/drinks?category=${category}`);
      const data = await res.json();
      setDrinks(data);
      setLoading(false);
    };
    fetchDrinks();
  }, [category]);

  const handleCustomize = (drink) => {
    router.push(`/customize/${drink.id}`);
  };

  return (
    <Box sx={{ backgroundColor: "#fef8f2", minHeight: "100vh" }}>
      <BottomTabBar />

      <Container maxWidth="md" sx={{ pb: 0 }}>
        <Button
          variant="text"
          onClick={() => router.back()}
          sx={{
            color: "#6f4e37",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.95rem",
            pl: 0,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          ← Back
        </Button>
      </Container>

      <Container
        maxWidth="md"
        sx={{
          pt: 2,
          pb: { xs: 12, sm: 14 },
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mb: 3,
            textAlign: { xs: "center", sm: "left" },
            color: "#6f4e37",
          }}
        >
          {emoji} {label}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 3,
          }}
        >
          {loading
            ? [...Array(6)].map((_, idx) => (
                <Skeleton
                  key={idx}
                  variant="rectangular"
                  animation="wave"
                  height={160}
                  sx={{
                    borderRadius: 3,
                    width: "100%",
                    minHeight: 160,
                  }}
                />
              ))
            : drinks.map((drink) => (
                <ProductCard
                  key={drink.id}
                  drink={drink}
                  onCustomize={handleCustomize}
                />
              ))}
        </Box>
      </Container>
    </Box>
  );
}
