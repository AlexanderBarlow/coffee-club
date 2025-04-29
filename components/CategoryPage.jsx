"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Typography,
  Container,
  Skeleton,
  Button as MuiButton,
} from "@mui/material";
import ProductCard from "@/components/ProductCard";
import BottomTabBar from "@/components/MobileNavbar";

const categories = [
  { key: "iced", label: "🧊 Iced" },
  { key: "hot", label: "🔥 Hot" },
  { key: "espresso", label: "☕ Espresso" },
  { key: "frappes", label: "🍧 Frappes" },
  { key: "tea", label: "🍵 Tea" },
  { key: "grub", label: "🍽️ Grub" },
];

export default function CategoryPage() {
  const { slug } = useParams(); // 'slug' from URL
  const router = useRouter();
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrinks = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/drinks?category=${slug}`);
        const data = await res.json();
        setDrinks(data);
      } catch (err) {
        console.error("Failed to fetch drinks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrinks();
  }, [slug]);

  const handleCategoryClick = (categoryKey) => {
    router.push(`/category/${categoryKey}`);
  };

  const handleCustomize = (drink) => {
    router.push(`/customize/${drink.id}`);
  };

  const currentCategoryLabel = categories.find((c) => c.key === slug)?.label || "";

  return (
    <Box sx={{ backgroundColor: "#fef8f2", minHeight: "100vh" }}>
      <BottomTabBar />

      <Container maxWidth="md" sx={{ pt: 2, pb: { xs: 12, sm: 14 } }}>
        {/* Categories Selector */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            justifyContent: { xs: "center", sm: "start" },
            mb: 4,
          }}
        >
          {categories.map((cat) => (
            <MuiButton
              key={cat.key}
              variant={slug === cat.key ? "contained" : "outlined"}
              size="small"
              onClick={() => handleCategoryClick(cat.key)}
              sx={{
                backgroundColor: slug === cat.key ? "#6f4e37" : "#fff",
                color: slug === cat.key ? "#fff" : "#6f4e37",
                borderColor: "#6f4e37",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: slug === cat.key ? "#5c3e2e" : "#f9f3ef",
                },
              }}
            >
              {cat.label}
            </MuiButton>
          ))}
        </Box>

        {/* Current Category Title */}
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mb: 3,
            textAlign: { xs: "center", sm: "left" },
            color: "#6f4e37",
          }}
        >
          {currentCategoryLabel}
        </Typography>

        {/* Drink Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
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
