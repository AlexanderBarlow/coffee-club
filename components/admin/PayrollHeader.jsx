
"use client";
import React from 'react';
import { Stack, Typography, Button, useMediaQuery, useTheme } from '@mui/material';

/**
 * PayrollHeader
 * Props:
 *  - payLoading: boolean
 *  - onSimulatePay: () => void
 */
export function PayrollHeader({ payLoading, onSimulatePay }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
      <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} color="#6f4e37">
        🕑 Payroll Management
      </Typography>
      <Button variant="contained" onClick={onSimulatePay} disabled={payLoading}>
        {payLoading ? 'Processing...' : 'Simulate Pay'}
      </Button>
    </Stack>
  );
}
