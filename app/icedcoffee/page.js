"use client";

import { useState } from "react";
import MuiButton from "@mui/material/Button";
import CategoryPage from "@/components/CategoryPage";

export default function IcedPage() {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedDrinkId, setSelectedDrinkId] = useState(null);

	return (
		<div>
			<MuiButton
				variant="contained"
				onClick={() => {
					setSelectedDrinkId("bcc6ec99-d89a-41f9-8717-409ea0b4e6c5");
					setModalOpen(true);
				}}
				sx={{
					width: "100%",
					backgroundColor: "#d32f2f",
					color: "#fff",
					fontSize: "1.2rem",
					fontWeight: "bold",
					py: 2,
					borderRadius: 0,
					"&:hover": {
						backgroundColor: "#b71c1c",
					},
				}}
			>
				🚨 FORCE OPEN MODAL
			</MuiButton>

			<CategoryPage
				initialCategory="iced"
				emoji="🧊"
				label="Iced Coffee"
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
				selectedDrinkId={selectedDrinkId}
				setSelectedDrinkId={setSelectedDrinkId}
			/>
		</div>
	);
}
