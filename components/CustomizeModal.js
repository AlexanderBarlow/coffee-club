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
} from "@mui/material";
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

    console.log("Hit Modal")

    const getAllowedCustomizations = (category) => {
        switch (category) {
            case "iced":
            case "hot":
            case "espresso":
            case "frappes":
                return {
                    milk: true,
                    syrup: true,
                    sauce: true,
                    extraShots: true,
                    size: true,
                    notes: true,
                };
            case "tea":
                return {
                    milk: false,
                    syrup: false,
                    sauce: false,
                    extraShots: false,
                    size: true,
                    notes: true,
                };
            case "grub":
            default:
                return {
                    milk: false,
                    syrup: false,
                    sauce: false,
                    extraShots: false,
                    size: true,
                    notes: true,
                };
        }
    };

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

    const allowed = drink ? getAllowedCustomizations(drink.category) : {};

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isMobile}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle
                sx={{ fontWeight: 700, textAlign: "center", color: "#6f4e37" }}
            >
                Customize Your Drink
            </DialogTitle>

            <DialogContent dividers sx={{ backgroundColor: "#fef8f2", pb: 4 }}>
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
                        {/* Drink Details */}
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

                        {/* Customization Fields */}
                        {allowed.size && (
                            <>
                                <Typography fontWeight={600}>Choose Your Size</Typography>
                                <ToggleButtonGroup
                                    exclusive
                                    value={customization.size}
                                    onChange={(e, val) =>
                                        val && setCustomization((prev) => ({ ...prev, size: val }))
                                    }
                                    sx={{ mb: 3 }}
                                >
                                    {["S", "M", "L"].map((size) => (
                                        <ToggleButton key={size} value={size}>
                                            {size}
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
                                    {["Whole", "Raw", "Skim", "Oat", "Almond", "Soy"].map(
                                        (milk) => (
                                            <ToggleButton key={milk} value={milk}>
                                                {milk}
                                            </ToggleButton>
                                        )
                                    )}
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
                                    <MenuItem value="Vanilla">Vanilla</MenuItem>
                                    <MenuItem value="Caramel">Caramel</MenuItem>
                                    <MenuItem value="Hazelnut">Hazelnut</MenuItem>
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
                                    <MenuItem value="Mocha">Mocha</MenuItem>
                                    <MenuItem value="White Chocolate">White Chocolate</MenuItem>
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
                                    setCustomization((p) => ({ ...p, notes: e.target.value }))
                                }
                                sx={{ mb: 3 }}
                            />
                        )}

                        {/* Final Summary */}
                        <Typography fontWeight={600} sx={{ mb: 2 }}>
                            Total: ${drink.price.toFixed(2)}
                        </Typography>

                        {/* Add to Cart Button */}
                        <AddToCartButton drink={drink} customization={customization} />
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
