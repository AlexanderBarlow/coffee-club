"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Skeleton,
  Button as MuiButton,
} from "@mui/material";
import ProductCard from "@/components/ProductCard";
import BottomTabBar from "@/components/MobileNavbar";
import CustomizeModal from "./CustomizeModal";

const categories = [
  { key: "iced", label: "🧊 Iced" },
  { key: "hot", label: "🔥 Hot" },
  { key: "espresso", label: "☕ Espresso" },
  { key: "tea", label: "🍵 Tea" },
  { key: "grub", label: "🍨 Grub" },
];

export default function CategoryPage({
  initialCategory = "iced",
  emoji,
  label,
  modalOpen: externalModalOpen,
  setModalOpen: setExternalModalOpen,
  selectedDrinkId: externalDrinkId,
  setSelectedDrinkId: setExternalDrinkId,
}) {
  const [currentCategory, setCurrentCategory] = useState(initialCategory);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [internalDrinkId, setInternalDrinkId] = useState(null);

  const modalOpen = externalModalOpen ?? internalModalOpen;
  const setModalOpen = setExternalModalOpen ?? setInternalModalOpen;
  const selectedDrinkId = externalDrinkId ?? internalDrinkId;
  const setSelectedDrinkId = setExternalDrinkId ?? setInternalDrinkId;

  useEffect(() => {
    const fetchDrinks = async () => {
      setLoading(true);
      const res = await fetch(`/api/drinks?category=${currentCategory}`);
      const data = await res.json();
      setDrinks(data);
      setLoading(false);
    };
    fetchDrinks();
  }, [currentCategory]);

  const handleCustomize = (drink) => {
    setSelectedDrinkId(drink.id);
    setModalOpen(true);
  };

  return (
    <Box sx={{ backgroundColor: "#fef8f2", minHeight: "100vh" }}>
      <BottomTabBar />

      <Container maxWidth="md" sx={{ pt: 2, pb: { xs: 12, sm: 14 } }}>
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
              variant={currentCategory === cat.key ? "contained" : "outlined"}
              size="small"
              sx={{
                backgroundColor:
                  currentCategory === cat.key ? "#6f4e37" : "#fff",
                color: currentCategory === cat.key ? "#fff" : "#6f4e37",
                borderColor: "#6f4e37",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  backgroundColor:
                    currentCategory === cat.key ? "#5c3e2e" : "#f9f3ef",
                },
              }}
              onClick={() => setCurrentCategory(cat.key)}
            >
              {cat.label}
            </MuiButton>
          ))}
        </Box>

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mb: 3,
            textAlign: { xs: "center", sm: "left" },
            color: "#6f4e37",
          }}
        >
          {categories.find((c) => c.key === currentCategory)?.label}
        </Typography>

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
                  sx={{ borderRadius: 3 }}
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

      <CustomizeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        drinkId={selectedDrinkId}
      />
    </Box>
  );
}
