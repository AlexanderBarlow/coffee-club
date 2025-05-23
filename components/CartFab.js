"use client";

import {
  Box,
  IconButton,
  Badge,
  Typography,
  Paper,
  Button,
  useMediaQuery,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useTheme } from "@mui/material/styles";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CartFab() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session?.user);
      setCheckingSession(false);
    };

    getInitialSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session?.user);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (checkingSession || !isMobile || cart.length === 0 || !isLoggedIn)
    return null;

  return (
    <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, paddingBottom: 0 }}>
      <Box
        onClick={() => setOpen((prev) => !prev)}
        sx={{ position: "relative" }}
      >
        <IconButton
          sx={{
            backgroundColor: "#6f4e37",
            color: "#fff",
            "&:hover": { backgroundColor: "#5c3e2e" },
            width: 56,
            height: 56,
            borderRadius: "50%",
            boxShadow: 4,
          }}
        >
          <Badge badgeContent={cart.length} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -10 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              style={{
                position: "absolute",
                bottom: 70,
                right: 0,
                width: 280,
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#fffdfb",
                  maxHeight: 320,
                  overflowY: "auto",
                }}
              >
                <Typography fontWeight={600} mb={1}>
                  Cart Preview
                </Typography>
                {cart.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography fontWeight={600} fontSize="0.9rem">
                      {item.name}
                    </Typography>
                    <Typography color="text.secondary">
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Box>
                ))}

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => router.push("/cart")}
                  sx={{
                    mt: 2,
                    backgroundColor: "#6f4e37",
                    "&:hover": { backgroundColor: "#5c3e2e" },
                    borderRadius: 99,
                    fontWeight: 600,
                  }}
                >
                  Go to Cart
                </Button>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
