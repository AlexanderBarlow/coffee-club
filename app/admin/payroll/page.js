"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  MenuItem,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { startOfYear, addYears, format, parseISO } from "date-fns";

// format dollars
const fmtCurrency = (v) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(v);

export default function PayrollPage() {
  const [filters, setFilters] = useState({
    from: null,
    to: null,
    employee: "all",
    search: "",
  });
  const [kpiThis, setKpiThis] = useState({});
  const [kpiLast, setKpiLast] = useState({});
  const [chartData, setChartData] = useState([]);

  // build query params
  const buildQ = (from, to) => {
    const q = new URLSearchParams();
    q.set("from", from.toISOString());
    q.set("to", to.toISOString());
    q.set("employee", filters.employee);
    q.set("search", filters.search);
    return q.toString();
  };

  // load this year & last year data
  async function loadData() {
    const today = new Date();
    const thisFrom = startOfYear(today);
    const thisTo = today;
    const lastFrom = addYears(thisFrom, -1);
    const lastTo = addYears(thisTo, -1);

    const [rThis, rLast] = await Promise.all([
      fetch(`/api/admin/payroll?${buildQ(thisFrom, thisTo)}`, { cache: "no-store" }),
      fetch(`/api/admin/payroll?${buildQ(lastFrom, lastTo)}`, { cache: "no-store" }),
    ]);
    const { summary: sThis, periods: pThis } = await rThis.json();
    const { summary: sLast, periods: pLast } = await rLast.json();

    setKpiThis(sThis);
    setKpiLast(sLast);

    // merge periods
    const data = pThis.map((r, i) => {
      const [s] = r.dateRange.split(" – ");
      const label = format(parseISO(s), "MMM d");
      return {
        label,
        "This Year": r.totalPay,
        "Last Year": pLast[i]?.totalPay || 0,
      };
    });
    setChartData(data);
  }

  useEffect(() => {
    loadData();
  }, [filters.employee, filters.search]);

  // KPI definitions
  const cards = [
    { label: "Total Payroll", thisVal: kpiThis.totalPayroll, lastVal: kpiLast.totalPayroll, format: fmtCurrency },
    { label: "Avg Hours/Emp", thisVal: kpiThis.avgHours, lastVal: kpiLast.avgHours, format: (v) => v.toFixed(1) },
    { label: "Overtime %", thisVal: kpiThis.overtimePct, lastVal: kpiLast.overtimePct, format: (v) => `${v}%` },
    { label: "Pending Adj.", thisVal: kpiThis.pendingAdj, lastVal: kpiLast.pendingAdj, format: (v) => v },
  ];

  const percentDiff = (curr, prev) =>
    prev ? Math.round(((curr - prev) / prev) * 100) : curr ? 100 : 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Filters */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2} alignItems="center" mb={4}>
          <Grid item xs="auto">
            <DatePicker
              label="From"
              value={filters.from}
              onChange={(v) => setFilters((f) => ({ ...f, from: v }))}
              renderInput={(p) => <TextField {...p} size="small" />}
            />
          </Grid>
          <Grid item xs="auto">
            <DatePicker
              label="To"
              value={filters.to}
              onChange={(v) => setFilters((f) => ({ ...f, to: v }))}
              renderInput={(p) => <TextField {...p} size="small" />}
            />
          </Grid>
          <Grid item xs="auto">
            <TextField
              select
              label="Employee"
              size="small"
              value={filters.employee}
              onChange={(e) => setFilters((f) => ({ ...f, employee: e.target.value }))}
            >
              <MenuItem value="all">All Employees</MenuItem>
              {/* TODO: map actual employees */}
            </TextField>
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              size="small"
              placeholder="Search"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            />
          </Grid>
          <Grid item xs="auto">
            <Button variant="contained" onClick={loadData}>
              Apply
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={5}>
        {cards.map(({ label, thisVal, lastVal, format }, i) => {
          const diff = percentDiff(thisVal || 0, lastVal || 0);
          const color = diff >= 0 ? "success" : "error";
          return (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">
                    {format(thisVal || 0)}
                  </Typography>
                  <Chip
                    label={`${diff > 0 ? "+" : ""}${diff}%`}
                    size="small"
                    color={color}
                  />
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {label}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Comparative Payroll Trend */}
      <Typography variant="h6" gutterBottom>
        Payroll Comparison: This Year vs. Last Year
      </Typography>
      <Paper sx={{ p: 2, height: { xs: 300, md: 400 } }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <defs>
              <linearGradient id="colorThis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) => fmtCurrency(v)}
              width={80}
            />
            <Tooltip formatter={(v) => fmtCurrency(v)} />
            <Legend verticalAlign="top" height={36} />
            <Area
              type="monotone"
              dataKey="Last Year"
              stroke="#8884d8"
              fill="url(#colorLast)"
              name="Last Year"
              dot={false}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="This Year"
              stroke="#82ca9d"
              fill="url(#colorThis)"
              name="This Year"
              dot={false}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
