"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Paper,
	CircularProgress,
	Select,
	MenuItem,
	TextField,
	Button,
	Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState([]);
	const [filteredOrders, setFilteredOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [statusFilter, setStatusFilter] = useState("");
	const [searchEmail, setSearchEmail] = useState("");

	const router = useRouter();

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await fetch("/api/admin/orders");
				const data = await res.json();
				setOrders(data);
				setFilteredOrders(data);
			} catch (err) {
				console.error("Failed to fetch orders", err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	useEffect(() => {
		let tempOrders = [...orders];

		if (statusFilter) {
			tempOrders = tempOrders.filter((order) => order.status === statusFilter);
		}

		if (searchEmail) {
			tempOrders = tempOrders.filter((order) =>
				order.user?.email?.toLowerCase().includes(searchEmail.toLowerCase())
			);
		}

		setFilteredOrders(tempOrders);
	}, [statusFilter, searchEmail, orders]);

	if (loading) {
		return (
			<Box sx={{ mt: 8, textAlign: "center" }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ p: 2 }}>
			<Typography variant="h4" fontWeight={700} color="#6f4e37" mb={4}>
				📦 Manage Orders
			</Typography>

			{/* Filters */}
			<Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
				<Select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					displayEmpty
					sx={{ minWidth: 160 }}
				>
					<MenuItem value="">All Statuses</MenuItem>
					<MenuItem value="PENDING">Pending</MenuItem>
					<MenuItem value="IN_PROGRESS">In Progress</MenuItem>
					<MenuItem value="COMPLETED">Completed</MenuItem>
					<MenuItem value="CANCELLED">Cancelled</MenuItem>
				</Select>

				<TextField
					label="Search by Email"
					value={searchEmail}
					onChange={(e) => setSearchEmail(e.target.value)}
					sx={{ minWidth: 240 }}
				/>

				<Button
					onClick={() => {
						setStatusFilter("");
						setSearchEmail("");
					}}
					sx={{
						backgroundColor: "#6f4e37",
						color: "white",
						"&:hover": { backgroundColor: "#5c3e2e" },
					}}
				>
					Clear Filters
				</Button>
			</Box>

			{/* Orders */}
			{filteredOrders.length === 0 ? (
				<Typography>No orders found.</Typography>
			) : (
				filteredOrders.map((order) => (
					<Paper
						key={order.id}
						sx={{
							mb: 3,
							p: 3,
							background: "#fff",
							borderRadius: 3,
							boxShadow: "0px 3px 10px rgba(0,0,0,0.07)",
						}}
					>
						<Typography fontWeight={600} fontSize="1.1rem" mb={1}>
							Order #{order.id.slice(0, 8)}...
						</Typography>
						<Typography color="text.secondary" mb={1}>
							Customer: {order.user?.email || "Unknown"}
						</Typography>
						<Typography color="text.secondary" mb={1}>
							Status: {order.status}
						</Typography>
						<Typography color="text.secondary" mb={1}>
							Payment: {order.paymentStatus}
						</Typography>
						<Typography color="text.secondary" mb={1}>
							Total: ${order.total?.toFixed(2)}
						</Typography>
						<Typography color="text.secondary">
							Placed on: {new Date(order.createdAt).toLocaleString()}
						</Typography>
						<Divider sx={{ mt: 2 }} />
					</Paper>
				))
			)}
		</Box>
	);
}
