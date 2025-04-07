"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import ProductCard from "@/components/ProductCard";
import BottomTabBar from "@/components/MobileNavbar";
import { useRouter } from "next/navigation";

export default function EspressoPage() {
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    const fetchDrinks = async () => {
      const res = await fetch("/api/drinks?category=iced");
      const data = await res.json();
      setDrinks(data);
    };
    fetchDrinks();
  }, []);

const router = useRouter();

const handleCustomize = (drink) => {
  router.push(`/customize/${drink.id}`);
};

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          minHeight: "100vh",
		  minWidth: '100vw',
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
          🧊 Iced Coffee
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
