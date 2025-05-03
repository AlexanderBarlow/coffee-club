"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Container,
  Button as MuiButton,
  Grid,
  Skeleton,
} from "@mui/material";
import BottomTabBar from "@/components/MobileNavbar";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

const categories = [
  { key: "iced", label: "🧊 Iced" },
  { key: "hot", label: "🔥 Hot" },
  { key: "espresso", label: "☕ Espresso" },
  { key: "frappes", label: "🍧 Frappes" },
  { key: "tea", label: "🍵 Tea" },
  { key: "grub", label: "🍽️ Grub" },
];

export default function MenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "iced";

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const isAtTop = window.scrollY < 5;
      setAtTop(isAtTop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchDrinks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/drinks?category=${selectedCategory}`);
        const data = await res.json();
        setDrinks(data);
      } catch (err) {
        console.error("Failed to fetch drinks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrinks();
  }, [selectedCategory]);

  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey);
    const params = new URLSearchParams(window.location.search);
    params.set("category", categoryKey);
    router.push(`/menu?${params.toString()}`);
  };

  return (
    <Box sx={{ backgroundColor: "#fef8f2", minHeight: "100vh", pb: 10 }}>
      <BottomTabBar />

      {/* Sticky Category Bar */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#fef8f2",
          py: 2,
          boxShadow: atTop ? "none" : "0px 2px 8px rgba(0,0,0,0.05)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              overflowX: { xs: "auto", sm: "visible" },
              display: "flex",
              flexWrap: { xs: "nowrap", sm: "wrap" },
              gap: 1.5,
              justifyContent: { xs: "start", sm: "center" },
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              px: { xs: 1, sm: 0 },
            }}
          >
            {categories.map((cat) => (
              <Box key={cat.key} sx={{ position: "relative", flexShrink: 0 }}>
                {selectedCategory === cat.key && (
                  <motion.div
                    layoutId="activeCategory"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 13,
                      backgroundColor: "#6f4e37",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      zIndex: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 0.4,
                    }}
                  />
                )}
                <MuiButton
                  component={motion.button}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryChange(cat.key)}
                  variant="outlined"
                  sx={{
                    zIndex: 1,
                    position: "relative",
                    backgroundColor: "transparent",
                    color: selectedCategory === cat.key ? "#fff" : "#6f4e37",
                    borderColor: "#6f4e37",
                    fontWeight: 600,
                    textTransform: "none",
                    px: 2,
                    py: 1,
                    minWidth: 100,
                    flexShrink: 0,
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  {cat.label}
                </MuiButton>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Drinks Grid */}
      <Container maxWidth="md">
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mt: 4,
            mb: 3,
            textAlign: "center",
            color: "#6f4e37",
          }}
        >
          {categories.find((c) => c.key === selectedCategory)?.label}
        </Typography>

        <Grid container spacing={3}>
          {loading
            ? [...Array(6)].map((_, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Skeleton
                    variant="rectangular"
                    height={180}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))
            : drinks.map((drink, idx) => (
                <Grid item xs={12} sm={6} key={drink.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ProductCard drink={drink} />
                  </motion.div>
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  );
}
