"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Divider,
  Paper,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";

export default function CustomizePage() {
  const { id } = useParams();
  const router = useRouter();
  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customization, setCustomization] = useState({
    milk: "Whole",
    sweetness: 50,
    extraShots: 0,
    notes: "",
  });

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`/api/drinks/${id}`);
        const data = await res.json();
        setDrink(data);
      } catch (err) {
        console.error("Error fetching drink:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [id, router]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
      ...drink,
      customization,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/cart");
  };

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  if (!drink) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 4 }}>
        Drink not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ px: 2, py: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Customize Your {drink.name}
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        {drink.description}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Milk</InputLabel>
          <Select
            value={customization.milk}
            label="Milk"
            onChange={(e) =>
              setCustomization((prev) => ({ ...prev, milk: e.target.value }))
            }
          >
            <MenuItem value="Whole">Whole</MenuItem>
            <MenuItem value="Skim">Skim</MenuItem>
            <MenuItem value="Oat">Oat</MenuItem>
            <MenuItem value="Almond">Almond</MenuItem>
            <MenuItem value="Soy">Soy</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Sweetness</Typography>
          <Slider
            value={customization.sweetness}
            onChange={(e, value) =>
              setCustomization((prev) => ({ ...prev, sweetness: value }))
            }
            valueLabelDisplay="auto"
            step={10}
            marks
            min={0}
            max={100}
          />
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Extra Shots</InputLabel>
          <Select
            value={customization.extraShots}
            label="Extra Shots"
            onChange={(e) =>
              setCustomization((prev) => ({
                ...prev,
                extraShots: e.target.value,
              }))
            }
          >
            {[0, 1, 2, 3].map((shot) => (
              <MenuItem key={shot} value={shot}>
                {shot} shot{shot !== 1 && "s"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Special Instructions"
          multiline
          fullWidth
          rows={3}
          value={customization.notes}
          onChange={(e) =>
            setCustomization((prev) => ({ ...prev, notes: e.target.value }))
          }
          sx={{ mb: 3 }}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Total:</strong> ${drink.price.toFixed(2)}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 1, py: 1.5, borderRadius: 2 }}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </Paper>
    </Box>
  );
}
