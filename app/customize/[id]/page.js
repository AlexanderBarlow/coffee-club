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
	TextField,
	Divider,
	Paper,
	ToggleButtonGroup,
	ToggleButton,
	useMediaQuery,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import ResponsiveNavbar from "@/components/MobileNavbar";
import AddToCartButton from "@/components/AddToCartButton";


export default function CustomizePage() {
	const { id } = useParams();
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width:600px)");

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


	if (loading) return <CircularProgress sx={{ mt: 5 }} />;

	if (!drink) {
		return (
			<Typography variant="h6" color="error" sx={{ mt: 4 }}>
				Drink not found.
			</Typography>
		);
	}

	return (
    <>
      <ResponsiveNavbar />
      <Box
        sx={{
          px: 2,
          py: 4,
          maxWidth: "100%",
          minHeight: "100vh",
          mx: "auto",
          background: "#fef8f2",
        }}
      >
        <Paper elevation={3} sx={{ p: 3, background: "#fff" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              mb: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{ color: "#6f4e37" }}
              >
                {drink.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {drink.description}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "relative",
                width: { xs: "100%", sm: 200 },
                height: { xs: 180, sm: 200 },
                borderRadius: 3,
                overflow: "hidden",
                flexShrink: 0,
                mx: { xs: "auto", sm: 0 },
              }}
            >
              <Image
                src={drink.imageUrl || "/images/fallback.jpg"}
                alt={drink.name}
                width={100}
                height={100}
                loading="lazy"
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "auto",
                  maxHeight: "100%",
                }}
              />
            </Box>
          </Box>

          <Typography gutterBottom fontWeight={600}>
            Choose Your Size
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={customization.size}
            onChange={(e, value) =>
              value && setCustomization((prev) => ({ ...prev, size: value }))
            }
            sx={{ mb: 3 }}
          >
            {["S", "M", "L"].map((size) => (
              <ToggleButton
                key={size}
                value={size}
                sx={{ borderRadius: "999px", textTransform: "none", px: 3 }}
              >
                {size}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Typography gutterBottom fontWeight={600}>
            Choose Your Milk
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
            {["Whole", "Raw", "Skim", "Oat", "Almond", "Soy"].map(
              (type, index) => {
                const emojis = ["🥛", "🧑‍🌾", "💧", "🌾", "🌰", "🫘"];
                return (
                  <ToggleButton
                    key={type}
                    value={type}
                    selected={customization.milk === type}
                    onClick={() =>
                      setCustomization((prev) => ({ ...prev, milk: type }))
                    }
                    sx={{
                      borderRadius: "999px",
                      textTransform: "none",
                      px: 2,
                      py: 1,
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      borderColor: "#ccc",
                      "&.Mui-selected": {
                        backgroundColor: "#6f4e37",
                        color: "#fff",
                      },
                    }}
                  >
                    {emojis[index]} {type}
                  </ToggleButton>
                );
              }
            )}
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Syrup</InputLabel>
            <Select
              value={customization.syrup}
              label="Syrup"
              onChange={(e) =>
                setCustomization((prev) => ({ ...prev, syrup: e.target.value }))
              }
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Vanilla">Vanilla</MenuItem>
              <MenuItem value="Caramel">Caramel</MenuItem>
              <MenuItem value="Hazelnut">Hazelnut</MenuItem>
              <MenuItem value="Pumpkin Spice">Pumpkin Spice</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Sauce</InputLabel>
            <Select
              value={customization.sauce}
              label="Sauce"
              onChange={(e) =>
                setCustomization((prev) => ({ ...prev, sauce: e.target.value }))
              }
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Mocha">Mocha</MenuItem>
              <MenuItem value="White Chocolate">White Chocolate</MenuItem>
              <MenuItem value="Caramel Sauce">Caramel Sauce</MenuItem>
            </Select>
          </FormControl>

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

          <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
            Total: ${drink.price.toFixed(2)}
          </Typography>

          <AddToCartButton drink={drink} customization={customization} />
        </Paper>
      </Box>
    </>
  );
}
