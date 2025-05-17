"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomizeModal({ open, onClose, drinkId }) {
  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("Modal Hit")

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
      } finally {
        setLoading(false);
      }
    };

    fetchDrink();
  }, [open, drinkId]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 16,
                right: 20,
                fontSize: "1.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              &times;
            </button>

            {loading ? (
              <p>Loading drink...</p>
            ) : drink ? (
              <>
                <h2>{drink.name}</h2>
                <img
                  src={drink.imageUrl || "/images/fallback.jpg"}
                  alt={drink.name}
                  style={{ width: "100%", borderRadius: "12px" }}
                />
                <p style={{ marginTop: "1rem", color: "#555" }}>
                  {drink.description}
                </p>
              </>
            ) : (
              <p>Error loading drink.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
