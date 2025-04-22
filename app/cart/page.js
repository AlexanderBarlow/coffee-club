"use client";

import { useCart } from "@/context/CartContext";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ResponsiveNavbar from "@/components/MobileNavbar";

export default function CartPage() {
  const { cart = [], isLoaded, removeFromCart } = useCart();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + (item?.price || 0), 0);

  return (
    <>
      <ResponsiveNavbar />
      <Box
        sx={{
          px: 2,
          py: 4,
          maxWidth: 900,
          mx: "auto",
          minHeight: "100vh",
          backgroundColor: "#fdf8f4",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mb: 4,
            pt: 6,
            color: "#6f4e37",
            textAlign: "center",
            letterSpacing: "-0.5px",
          }}
        >
          🛒 Your Cart
        </Typography>

        {cart.length === 0 ? (
          <Typography
            sx={{
              color: "#8c7b75",
              textAlign: "center",
              mt: 10,
              fontSize: "1.1rem",
            }}
          >
            Your cart is empty — let’s fix that with some fresh brews!
          </Typography>
        ) : (
          <>
            {cart.map((item, index) => (
              <Paper
                key={index}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  mb: 3,
                  p: 2,
                  borderRadius: 4,
                  backgroundColor: "#fff",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={item.imageUrl || "/images/fallback.jpg"}
                    alt={item.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>

                <Box flex={1}>
                  <Typography
                    fontWeight={600}
                    fontSize="1.05rem"
                    sx={{ color: "#3e3028", mb: 0.5 }}
                  >
                    {item.name || "Unnamed Drink"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Size: {item.customization?.size || "N/A"} | Milk:{" "}
                    {item.customization?.milk || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Syrup: {item.customization?.syrup || "None"} | Sauce:{" "}
                    {item.customization?.sauce || "None"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Shots: {item.customization?.extraShots || 0}
                  </Typography>

                  {item.customization?.notes && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic", mt: 0.5 }}
                    >
                      “{item.customization.notes}”
                    </Typography>
                  )}

                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mt: 1.2, color: "#6f4e37" }}
                  >
                    ${item.price?.toFixed(2) || "0.00"}
                  </Typography>
                </Box>

                <IconButton
                  onClick={() => removeFromCart(index)}
                  sx={{ mt: 1 }}
                >
                  <Delete sx={{ color: "#9b837a" }} />
                </IconButton>
              </Paper>
            ))}

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: "#3e3028", mb: { xs: 2, sm: 0 } }}
              >
                Subtotal: ${subtotal.toFixed(2)}
              </Typography>

              <Button
                variant="contained"
                onClick={() => router.push("/checkout")}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 99,
                  backgroundColor: "#6f4e37",
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "#5c3e2e",
                  },
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
