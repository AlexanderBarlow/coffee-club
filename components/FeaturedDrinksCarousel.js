// components/FeaturedDrinksCarousel.js
"use client";

import { useKeenSlider } from "keen-slider/react";
import { Box, Typography, Paper } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import "keen-slider/keen-slider.min.css";

export default function FeaturedDrinksCarousel({ featuredDrinks }) {
    const [sliderRef] = useKeenSlider({
        loop: true,
        mode: "snap",
        slides: { perView: 1.2, spacing: 16 },
        breakpoints: {
            "(min-width: 640px)": { slides: { perView: 2.25, spacing: 20 } },
            "(min-width: 1024px)": { slides: { perView: 3, spacing: 24 } },
        },
    });

    return (
      <Box sx={{ mt: 6 }}>
        <Box className="keen-slider" ref={sliderRef}>
          {featuredDrinks.map((drink) => (
            <Box
              key={drink.id}
              className="keen-slider__slide"
              sx={{ px: 1, minWidth: 240, maxWidth: 260 }}
            >
              <motion.div whileHover={{ scale: 1.03 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Image
                    src={drink.imageUrl || "/images/fallback.jpg"}
                    alt={drink.name}
                    width={160}
                    height={160}
                    style={{ borderRadius: 12, objectFit: "cover" }}
                  />
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mt: 1 }}
                  >
                    {drink.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      color: "#5a4a3c",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {drink.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ mt: 1, color: "#3e3028" }}
                  >
                    ${drink.price.toFixed(2)}
                  </Typography>
                </Paper>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Box>
    );
}