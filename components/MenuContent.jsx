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
import { motion, AnimatePresence } from "framer-motion";
import BottomTabBar from "@/components/MobileNavbar";
import ProductCard from "@/components/ProductCard";
import CustomizeModal from "@/components/CustomizeModal";

export default function MenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDrinkId, setSelectedDrinkId] = useState(null);

  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey);
    const params = new URLSearchParams(window.location.search);
    params.set("category", categoryKey);
    router.push(`/menu?${params.toString()}`);
  };

  const handleCustomize = (drink) => {
    setSelectedDrinkId(drink.id);
    setModalOpen(true);
  };

  // Fetch categories from the DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();

        const formatted = data
          .map((cat) => ({
            key: cat.name.toLowerCase(),
            label: `${cat.emoji ?? ""} ${cat.name}`,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCategories(formatted);

        const defaultKey = categoryFromUrl || "iced";
        const exists = formatted.find((cat) => cat.key === defaultKey);
        setSelectedCategory(exists ? defaultKey : formatted[0]?.key);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch drinks for the selected category
  useEffect(() => {
    if (!selectedCategory) return;

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

  if (!categories.length || !selectedCategory) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#fef8f2" }}>
        <BottomTabBar />
        <Container sx={{ pt: 10, textAlign: "center" }}>
          <Typography variant="h6">Loading categories...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#fef8f2", minHeight: "100vh", pb: 10 }}>
      <BottomTabBar />

      {/* Sticky category bar */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(254, 248, 242, 0.85)",
          paddingTop: `calc(env(safe-area-inset-top) + 4px)`,
          paddingBottom: 1,
          mb: -4,
          "::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "env(safe-area-inset-top)",
            backgroundColor: "rgba(254, 248, 242, 0.9)",
            zIndex: -1,
          },
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
              <MuiButton
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                variant="outlined"
                sx={{
                  backgroundColor:
                    selectedCategory === cat.key ? "#6f4e37" : "transparent",
                  color: selectedCategory === cat.key ? "#fff" : "#6f4e37",
                  borderColor: "#6f4e37",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  minWidth: 100,
                  flexShrink: 0,
                  "&:hover": {
                    backgroundColor:
                      selectedCategory === cat.key
                        ? "#5a3c2c"
                        : "rgba(111, 78, 55, 0.1)",
                  },
                }}
              >
                {cat.label}
              </MuiButton>
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

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
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
                : drinks.map((drink) => (
                    <Grid item xs={12} sm={6} key={drink.id}>
                      <ProductCard
                        drink={drink}
                        onCustomize={handleCustomize}
                      />
                    </Grid>
                  ))}
            </Grid>
          </motion.div>
        </AnimatePresence>
      </Container>

      {/* Customize Modal */}
      <CustomizeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        drinkId={selectedDrinkId}
      />
    </Box>
  );
}
