"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import BottomTabBar from "@/components/MobileNavbar";

const menuCategories = [
  { title: "Iced Coffees", emoji: "🧊", link: "/icedcoffee" },
  { title: "Hot Coffees", emoji: "☕", link: "/hotcoffee" },
  { title: "Espresso", emoji: "⚡", link: "/espresso" },
  { title: "Frappes", emoji: "🍧", link: "/frappes" },
  { title: "Tea", emoji: "🍵", link: "/tea" },
  { title: "Grub", emoji: "🍽️", link: "/grub" },
];

export default function MenuPage() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #fffaf7, #fefefe)",
        paddingBottom: 10,
      }}
    >
      <BottomTabBar />

      <Box sx={{ px:3, pb: 6, pt: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            textAlign="center"
            sx={{ color: "#6f4e37" }}
          >
            Our Crafted Menu
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 1, color: "#6f4e37", opacity: 0.7 }}
          >
            Explore our full lineup of drinks and bites
          </Typography>
        </motion.div>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          {menuCategories.map((category, i) => (
            <Grid item xs={6} sm={4} key={category.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  onClick={() => router.push(category.link)}
                  sx={{
                    borderRadius: 5,
                    py: 3,
                    px: 2,
                    textAlign: "center",
                    background: "#fff",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                    "&:hover": {
                      background: "#fef4ec",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent>
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Typography fontSize={38}>{category.emoji}</Typography>
                    </motion.div>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ mt: 1, color: "#3e3028" }}
                    >
                      {category.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
