"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formState, setFormState] = useState({ name: "", emoji: "" });
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formState.name.trim()) return;

    try {
      if (editId) {
        await fetch(`/api/admin/categories/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        });
      } else {
        await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        });
      }

      setOpenDialog(false);
      setFormState({ name: "", emoji: "" });
      setEditId(null);
      fetchCategories();
    } catch (err) {
      console.error("Failed to save category:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="#6f4e37"
        textAlign="center"
        mb={4}
      >
        📂 Manage Categories
      </Typography>

      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Button
          variant="contained"
          onClick={() => {
            setEditId(null);
            setFormState({ name: "", emoji: "" });
            setOpenDialog(true);
          }}
          sx={{
            borderRadius: 999,
            px: 4,
            py: 1,
            backgroundColor: "#6f4e37",
            "&:hover": { backgroundColor: "#5c3e2e" },
          }}
        >
          ➕ Add New Category
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 3,
          }}
        >
          {categories.map((cat) => (
            <Paper
              key={cat.id}
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                borderRadius: 3,
                backgroundColor: "#fffaf7",
              }}
            >
              <Typography fontSize={48}>{cat.emoji || "📦"}</Typography>

              <Typography
                variant="h6"
                fontWeight={600}
                textAlign="center"
                color="#6f4e37"
              >
                {cat.name}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <IconButton
                  onClick={() => {
                    setEditId(cat.id);
                    setFormState({ name: cat.name, emoji: cat.emoji || "" });
                    setOpenDialog(true);
                  }}
                  size="small"
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(cat.id)}
                  size="small"
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: "#6f4e37" }}>
          {editId ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Category Name"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Emoji (Optional)"
            value={formState.emoji}
            onChange={(e) =>
              setFormState({ ...formState, emoji: e.target.value })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "#6f4e37",
              "&:hover": { backgroundColor: "#5c3e2e" },
            }}
          >
            {editId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
