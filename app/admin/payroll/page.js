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
  Drawer,
  IconButton,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CloseIcon from "@mui/icons-material/Close";
import { parseISO, format } from "date-fns";

export default function PayrollPage() {
  // filter state
  const [filters, setFilters] = useState({
    from: null,
    to: null,
    employee: "all",
    search: "",
  });

  // data state
  const [kpi, setKpi] = useState({
    totalPayroll: 0,
    avgHours: 0,
    overtimePct: 0,
    pendingAdj: 0,
  });
  const [periods, setPeriods] = useState([]);
  const [trendData, setTrendData] = useState([]);

  // selection state
  const [selectedRows, setSelectedRows] = useState([]);

  // detail drawer
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // build the query string from filters
  function buildQuery() {
    const q = new URLSearchParams();
    if (filters.from) q.set("from", filters.from.toISOString());
    if (filters.to) q.set("to", filters.to.toISOString());
    if (filters.employee) q.set("employee", filters.employee);
    if (filters.search) q.set("search", filters.search);
    return q.toString();
  }

  // load data from API
  async function loadData() {
    const qs = buildQuery();
    const res = await fetch(`/api/admin/payroll?${qs}`, { cache: "no-store" });
    if (!res.ok) {
      console.error("Failed to fetch payroll:", await res.text());
      return;
    }
    const { summary, periods } = await res.json();

    setKpi({
      totalPayroll: summary.totalPayroll,
      avgHours: summary.avgHours,
      overtimePct: summary.overtimePct,
      pendingAdj: summary.pendingAdj,
    });

    setPeriods(periods);

    // derive trendData: one unique label per period
    const chart = periods.map((r) => {
      const [startISO, endISO] = r.dateRange.split(" – ");
      const start = parseISO(startISO);
      const end = parseISO(endISO);
      const label = `${format(start, "MMM d")}–${format(end, "d")}`;
      return { label, hours: r.hours, totalPay: r.totalPay };
    });
    setTrendData(chart);

    setSelectedRows([]);
  }

  useEffect(() => {
    loadData();
  }, []);

  // columns config
  const columns = [
    {
      field: "dateRange",
      headerName: "Date Range",
      width: 260,
      renderCell: ({ value }) => {
        const [startISO, endISO] = value.split(" – ");
        const start = parseISO(startISO);
        const end = parseISO(endISO);
        return `${format(start, "MMM d, yyyy")} – ${format(
          end,
          "MMM d, yyyy"
        )}`;
      },
    },
    { field: "totalPay", headerName: "Total Due", width: 140 },
    { field: "status", headerName: "Status", width: 120 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* 1) Filter Panel */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <DatePicker
                label="From"
                value={filters.from}
                onChange={(newVal) =>
                  setFilters((f) => ({ ...f, from: newVal }))
                }
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Grid>
            <Grid item>
              <DatePicker
                label="To"
                value={filters.to}
                onChange={(newVal) => setFilters((f) => ({ ...f, to: newVal }))}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Grid>
            <Grid item>
              <TextField
                select
                label="Employee"
                value={filters.employee}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, employee: e.target.value }))
                }
                size="small"
              >
                <MenuItem value="all">All Employees</MenuItem>
                {/* map your employees here */}
              </TextField>
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Search"
                value={filters.search}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
                size="small"
              />
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={loadData}>
                Apply
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  setFilters({
                    from: null,
                    to: null,
                    employee: "all",
                    search: "",
                  });
                  loadData();
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </LocalizationProvider>

      {/* 2) KPI Summary */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: "Total Payroll", value: kpi.totalPayroll },
          { label: "Avg Hours/Emp", value: kpi.avgHours },
          { label: "Overtime %", value: `${kpi.overtimePct}%` },
          { label: "Pending Adj.", value: kpi.pendingAdj },
        ].map((card, i) => (
          <Grid item xs={6} sm={3} key={i}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">{card.value}</Typography>
              <Typography color="text.secondary">{card.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 3) Trend Visualization */}
      <Paper sx={{ p: 2, height: 300, mb: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trendData}>
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="hours" barSize={20} fill="#8884d8" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalPay"
              stroke="#82ca9d"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Paper>

      {/* 4) Pay Periods Table */}
      <Paper sx={{ height: 400, mb: 3 }}>
        <DataGrid
          rows={periods}
          columns={columns}
          hideFooter
          onRowClick={({ row }) => {
            setDetailData(row);
            setDetailOpen(true);
          }}
        />
      </Paper>

      {/* 5) Detail Sidebar */}
      <Drawer
        anchor="right"
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      >
        <Box sx={{ width: 350, p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Period Details</Typography>
            <IconButton onClick={() => setDetailOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          {/* render detailData info here */}
        </Box>
      </Drawer>

      {/* 6) Actions Bar */}
      <Stack direction="row" spacing={2}>
        <Button disabled={!selectedRows.length}>Recalculate</Button>
        <Button disabled={!selectedRows.length}>Export CSV</Button>
        <Button disabled={!selectedRows.length} variant="contained">
          Finalize Pay
        </Button>
      </Stack>
    </Box>
  );
}
