"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function EditDrinkModal({ open, onClose, drink, onUpdated }) {
  const [syrups, setSyrups] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [milks, setMilks] = useState([]);

  const [selectedSyrups, setSelectedSyrups] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [selectedMilks, setSelectedMilks] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  const availableSizes = ["Small", "Medium", "Large"];

  useEffect(() => {
    if (open && drink) {
      setSelectedSyrups(drink.syrups?.map((s) => s.id) || []);
      setSelectedSauces(drink.sauces?.map((s) => s.id) || []);
      setSelectedMilks(drink.milks?.map((m) => m.id) || []);
      setSelectedSizes(
        Array.isArray(drink.customizeOptions) ? drink.customizeOptions : []
      );
    }
  }, [open, drink]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch("/api/admin/options");
        const { syrups, sauces, milks } = await res.json();
        setSyrups(syrups);
        setSauces(sauces);
        setMilks(milks);
      } catch (err) {
        console.error("Failed to load customization options", err);
      }
    };
    fetchOptions();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/drinks/${drink.id}/update-customizations`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            syrupIds: selectedSyrups,
            sauceIds: selectedSauces,
            milkIds: selectedMilks,
            sizes: selectedSizes,
          }),
        }
      );

      if (res.ok) {
        onUpdated();
        onClose();
      } else {
        console.error("Update failed");
      }
    } catch (err) {
      console.error("Error updating drink customizations", err);
    } finally {
      setLoading(false);
    }
  };

  const renderMultiSelect = (label, value, onChange, options, idKey = "id") => (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(e) => onChange(e.target.value)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) =>
          options
            .filter((opt) => selected.includes(opt[idKey]))
            .map((opt) => opt.name)
            .join(", ")
        }
      >
        {options.map((opt) => (
          <MenuItem key={opt[idKey]} value={opt[idKey]}>
            <Checkbox checked={value.includes(opt[idKey])} />
            <ListItemText primary={opt.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Customizations for {drink?.name}</DialogTitle>
      <DialogContent>
        {renderMultiSelect("Syrups", selectedSyrups, setSelectedSyrups, syrups)}
        {renderMultiSelect("Sauces", selectedSauces, setSelectedSauces, sauces)}
        {renderMultiSelect("Milks", selectedMilks, setSelectedMilks, milks)}
        {renderMultiSelect(
          "Sizes",
          selectedSizes,
          setSelectedSizes,
          availableSizes.map((s) => ({ id: s, name: s })),
          "id"
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
