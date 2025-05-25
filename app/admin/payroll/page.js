// components/admin/payroll/PayrollPage.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { PayrollHeader } from "@/components/admin/PayrollHeader";
import { PayrollList } from "@/components/admin/PayrollList";

export default function PayrollPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [editState, setEditState] = useState({});
  const [savingState, setSavingState] = useState({});

  // Fetch payroll on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/payroll", { cache: "no-store" });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching payroll:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Simulate pay action reloads all
  const handleSimulatePay = async () => {
    setPayLoading(true);
    try {
      await fetch("/api/admin/payroll", { method: "POST" });
      // full reload
      const res = await fetch("/api/admin/payroll", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error simulating pay:", err);
    } finally {
      setPayLoading(false);
    }
  };

  // Handle inline edits and save only that row
  const handleFieldChange = (id, field, value) => {
    setData((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: Number(value) } : u))
    );
    setEditState((prev) => ({ ...prev, [id]: true }));
  };

  const handleSave = async (id) => {
    const user = data.find((u) => u.id === id);
    setSavingState((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/admin/payroll/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hoursWorked: user.hoursWorked,
          hourlyRate: user.hourlyRate,
        }),
      });
      const updated = await res.json();
      // update only this record locally
      setData((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
      );
      setEditState((prev) => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error("Error saving payroll:", err);
    } finally {
      setSavingState((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <PayrollHeader
        payLoading={payLoading}
        onSimulatePay={handleSimulatePay}
      />
      <PayrollList
        data={data}
        loading={loading}
        savingState={savingState}
        editState={editState}
        onFieldChange={handleFieldChange}
        onSave={handleSave}
      />
    </Box>
  );
}
