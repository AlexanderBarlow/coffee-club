"use client"

import { useEffect } from "react";

export default function CheckoutPage() {

	useEffect(() => {
		const initiateCheckout = async () => {
			const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

			const response = await fetch("/api/create-checkout-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ cartItems }),
			});

			const data = await response.json();
			console.log(data);

			if (data.url) {
				window.location.href = data.url;
			} else {
				console.error("Failed to create checkout session");
			}
		};

		initiateCheckout();
	}, []);

	return <p>Redirecting to checkout...</p>;
}
