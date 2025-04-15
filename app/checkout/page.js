"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CheckoutPage() {
	useEffect(() => {
		const initiateCheckout = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session?.user?.id) {
				console.error("No user session found");
				return;
			}

			const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

			const response = await fetch("/api/create-checkout-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: session.user.id,
					cartItems,
				}),
			});

			const data = await response.json();
			console.log("Stripe session response:", data);

			if (data.url) {
				window.location.href = data.url;
			} else {
				console.error("❌ Failed to create checkout session");
			}
		};

		initiateCheckout();
	}, []);

	return (
		<p style={{ textAlign: "center", marginTop: "2rem" }}>
			Redirecting to checkout...
		</p>
	);
}
