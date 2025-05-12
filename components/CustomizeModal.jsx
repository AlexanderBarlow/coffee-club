"use client";

import {
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";

export default function CustomizeModal({ open, onClose, drinkId }) {
  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customization, setCustomization] = useState({
    milk: "Whole",
    syrup: "",
    sauce: "",
    extraShots: 0,
    size: "M",
    notes: "",
  });

  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (!open || !drinkId) return;
    const fetchDrink = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/drinks/${drinkId}`);
        const data = await res.json();
        setDrink(data);
      } catch (err) {
        console.error("Error fetching drink:", err);
        setDrink(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDrink();
  }, [open, drinkId]);

  const allowed = drink?.customizeOptions || {};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: isMobile ? "100vh" : "90vh",
          borderRadius: isMobile ? 0 : 3,
        },
      }}
    >
      {/* 🔺 Sticky title bar for mobile with close button */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: "#fff",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="#6f4e37">
          Customize
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent
        dividers
        sx={{
          backgroundColor: "#fef8f2",
          py: isMobile ? 2 : 3,
          px: isMobile ? 1.5 : 3,
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : !drink ? (
          <Typography color="error" align="center" mt={4}>
            Sorry, we couldn't load this drink.
          </Typography>
        ) : (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h5" fontWeight={600}>
                {drink.name}
              </Typography>

              <Image
                src={drink.imageUrl || "/images/fallback.jpg"}
                alt={drink.name}
                width={200}
                height={200}
                style={{
                  objectFit: "contain",
                  margin: "0 auto",
                  borderRadius: 12,
                }}
              />

              <Typography variant="body2" color="text.secondary">
                {drink.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {allowed.size && (
              <>
                <Typography fontWeight={600}>Size</Typography>
                <ToggleButtonGroup
                  exclusive
                  value={customization.size}
                  onChange={(e, val) =>
                    val && setCustomization((prev) => ({ ...prev, size: val }))
                  }
                  sx={{ mb: 3 }}
                >
                  {["S", "M", "L"].map((s) => (
                    <ToggleButton key={s} value={s}>
                      {s}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </>
            )}

            {allowed.milk && (
              <>
                <Typography fontWeight={600}>Milk</Typography>
                <ToggleButtonGroup
                  exclusive
                  value={customization.milk}
                  onChange={(e, val) =>
                    val && setCustomization((p) => ({ ...p, milk: val }))
                  }
                  sx={{ flexWrap: "wrap", mb: 3 }}
                >
                  {drink.milks?.map((milk) => (
                    <ToggleButton key={milk.name} value={milk.name}>
                      {milk.name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </>
            )}

            {allowed.syrup && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Syrup</InputLabel>
                <Select
                  value={customization.syrup}
                  onChange={(e) =>
                    setCustomization((p) => ({
                      ...p,
                      syrup: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  {drink.syrups?.map((syrup) => (
                    <MenuItem key={syrup.name} value={syrup.name}>
                      {syrup.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {allowed.sauce && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Sauce</InputLabel>
                <Select
                  value={customization.sauce}
                  onChange={(e) =>
                    setCustomization((p) => ({
                      ...p,
                      sauce: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  {drink.sauces?.map((sauce) => (
                    <MenuItem key={sauce.name} value={sauce.name}>
                      {sauce.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {allowed.extraShots && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Extra Shots</InputLabel>
                <Select
                  value={customization.extraShots}
                  onChange={(e) =>
                    setCustomization((p) => ({
                      ...p,
                      extraShots: e.target.value,
                    }))
                  }
                >
                  {[0, 1, 2, 3].map((shot) => (
                    <MenuItem key={shot} value={shot}>
                      {shot}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {allowed.notes && (
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Special Instructions"
                value={customization.notes}
                onChange={(e) =>
                  setCustomization((p) => ({
                    ...p,
                    notes: e.target.value,
                  }))
                }
                sx={{ mb: 3 }}
              />
            )}

            <Typography fontWeight={600} sx={{ mb: 2 }}>
              Total: ${drink.price.toFixed(2)}
            </Typography>

            <AddToCartButton
              drink={drink}
              customization={customization}
              onClose={onClose}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
