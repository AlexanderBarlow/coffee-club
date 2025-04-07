"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import ProductCard from "@/components/ProductCard";
import BottomTabBar from "@/components/MobileNavbar";

export default function EspressoPage() {
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    const fetchDrinks = async () => {
      const res = await fetch("/api/drinks?category=espresso");
      const data = await res.json();
      setDrinks(data);
    };
    fetchDrinks();
  }, []);

  const handleCustomize = (drink) => {
    console.log("Customize clicked for:", drink.name);
  };

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          minHeight: "100vh",
          paddingBottom: 10,
          pt: { xs: 6, sm: 8 },
          backgroundColor: "#fef8f2", // Cream background
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
          ⚡ Espresso
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          {drinks.map((drink) => (
            <Box
              key={drink.name}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(33.333% - 16px)",
                },
                display: "flex",
              }}
            >
              <ProductCard drink={drink} onCustomize={handleCustomize} />
            </Box>
          ))}
        </Box>
      </Container>

      <BottomTabBar />
    </>
  );
}
