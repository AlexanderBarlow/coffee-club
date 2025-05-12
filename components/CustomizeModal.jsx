"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";

export default function CustomizeModal({ open, onClose, drinkId }) {
  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customization, setCustomization] = useState({
    milk: "Whole",
    size: "M",
    syrup: "",
    sauce: "",
    extraShots: 0,
    notes: "",
  });

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

  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            style={{
              background: "#fff",
              borderRadius: "1rem",
              padding: "1.5rem",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              position: "relative",
              color: "#3e3028",
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                fontSize: "1.5rem",
                color: "#999",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              &times;
            </button>

            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p style={{ fontSize: "1.1rem", color: "#6f4e37" }}>
                  Brewing your drink...
                </p>
              </div>
            ) : drink ? (
              <>
                <h2
                  style={{
                    marginTop: "1.5rem",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#6f4e37",
                    textAlign: "center",
                  }}
                >
                  {drink.name}
                </h2>

                <img
                  src={drink.imageUrl || "/images/fallback.jpg"}
                  alt={drink.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "contain",
                    borderRadius: "12px",
                    margin: "1rem 0",
                    background: "#f8f6f3",
                  }}
                />

                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.5,
                    textAlign: "center",
                    color: "#5e4b44",
                    marginBottom: "1.5rem",
                  }}
                >
                  {drink.description}
                </p>

                {/* Dynamic customization options */}
                {drink.customizeOptions?.size && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontWeight: 600 }}>Size:</label>
                    <select
                      value={customization.size}
                      onChange={(e) => handleChange("size", e.target.value)}
                      style={{ width: "100%", padding: "8px", marginTop: 4 }}
                    >
                      <option value="S">Small</option>
                      <option value="M">Medium</option>
                      <option value="L">Large</option>
                    </select>
                  </div>
                )}

                {drink.customizeOptions?.milk && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontWeight: 600 }}>Milk:</label>
                    <select
                      value={customization.milk}
                      onChange={(e) => handleChange("milk", e.target.value)}
                      style={{ width: "100%", padding: "8px", marginTop: 4 }}
                    >
                      {["Whole", "Skim", "Oat", "Almond", "Soy", "Raw"].map(
                        (m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

                {drink.customizeOptions?.syrup && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontWeight: 600 }}>Syrup:</label>
                    <select
                      value={customization.syrup}
                      onChange={(e) => handleChange("syrup", e.target.value)}
                      style={{ width: "100%", padding: "8px", marginTop: 4 }}
                    >
                      <option value="">None</option>
                      {drink.syrups?.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {drink.customizeOptions?.sauce && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontWeight: 600 }}>Sauce:</label>
                    <select
                      value={customization.sauce}
                      onChange={(e) => handleChange("sauce", e.target.value)}
                      style={{ width: "100%", padding: "8px", marginTop: 4 }}
                    >
                      <option value="">None</option>
                      {drink.sauces?.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {drink.customizeOptions?.extraShots && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ fontWeight: 600 }}>Extra Shots:</label>
                    <select
                      value={customization.extraShots}
                      onChange={(e) =>
                        handleChange("extraShots", Number(e.target.value))
                      }
                      style={{ width: "100%", padding: "8px", marginTop: 4 }}
                    >
                      {[0, 1, 2, 3].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {drink.customizeOptions?.notes && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ fontWeight: 600 }}>Notes:</label>
                    <textarea
                      value={customization.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      placeholder="Special instructions..."
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        marginTop: 4,
                      }}
                    />
                  </div>
                )}

                <div style={{ marginTop: "2rem" }}>
                  <AddToCartButton
                    drink={drink}
                    customization={customization}
                  />
                </div>
              </>
            ) : (
              <p style={{ textAlign: "center", color: "#b00020" }}>
                Error loading drink.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
